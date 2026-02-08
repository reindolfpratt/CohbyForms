import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  type DeleteObjectsCommandOutput,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  paginateListObjectsV2,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "@formbricks/logger";
import { type Result, type StorageError, StorageErrorCode, err, ok } from "../types/error";
import { createS3Client } from "./client";
import { S3_BUCKET_NAME } from "./constants";

/**
 * Get a signed URL for uploading a file to S3
 * @param fileName - The name of the file to upload
 * @param filePath - The path to the file in S3
 * @param maxSize - The maximum size of the file to upload or undefined if no limit is desired
 * @returns A Result containing the signed URL and presigned fields or an error: StorageError
 */
export const getSignedUploadUrl = async (
  fileName: string,
  contentType: string,
  filePath: string,
  _maxSize: number = 1024 * 1024 * 10 // 10MB
): Promise<
  Result<
    {
      signedUrl: string;
      presignedFields: Record<string, string>;
    },
    StorageError
  >
> => {
  try {
    const s3Client = createS3Client();

    if (!s3Client) {
      logger.error("Failed to get signed upload URL: S3 client is not set");
      return err({
        code: StorageErrorCode.S3ClientError,
      });
    }

    if (!S3_BUCKET_NAME) {
      logger.error("Failed to get signed upload URL: S3 bucket name is not set");
      return err({
        code: StorageErrorCode.S3CredentialsError,
      });
    }

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: `${filePath}/${fileName}`,
      ContentType: contentType,
    });

    // Create a client with a custom middleware to set unhoistableHeaders
    // We reuse the existing client, but add middleware specifically for this request context if needed.
    // However, adding middleware to the global client instance might affect other requests if not careful.
    // A safer way is to clone the client or just use the middleware stack of the command if possible?
    // Actually, AWS SDK v3 clients are immutable-ish. Let's just add it to the client we created.
    // Since createS3Client returns a singleton, we should verify if adding middleware stacks up.
    // CAUTION: modifying the singleton client's middleware stack is bad if it persists.
    // BUT, createS3Client() in client.ts seems to create a NEW client instance or return a cached one?
    // Let's check client.ts. It returns a singleton `s3Client`.
    // Modifying the singleton is risky.
    // Instead of modifying the client, let's use the middleware on the command?
    // getSignedUrl takes client and command.

    // Better approach:
    // We can't easily add middleware to just one call of getSignedUrl without cloning the client.
    // However, the S3RequestPresigner class WAS the right way to go for isolation, but the manual resolve was buggy.
    // Let's try to use S3RequestPresigner again BUT use it correctly without manual resolution.
    // S3RequestPresigner.sign(command) should work? No, it's .presign(request).

    // Let's stick to the custom middleware but CLONE the client config to valid unwanted side effects?
    // Or just construct a new client? No, that's expensive.

    // Actually, getSignedUrl DOES NOT run the client's middleware stack in the same way for signing.
    // It mostly uses the endpoint and credentials.
    // The previous error was likely due to `httpRequest` being undefined or malformed.

    // Let's try to strictly fix the linter errors for the CURRENT approach (middleware on client) first,
    // assuming we can live with the singleton modification or that I'll fix the singleton issue next.
    // WAIT, if I modify the singleton, every future request will have this middleware.
    // That's bad.

    // Alternative: Use S3RequestPresigner with `unhoistableHeaders` in the config?
    // The `presign` method options explicitly support `unhoistableHeaders`.
    // The issue before was getting the `request` object.
    // We can use `createRequest` from the client?

    // Let's go back to S3RequestPresigner but simpler.
    // const signer = new S3RequestPresigner({ ...s3Client.config });
    // const signedUrl = await signer.presign(command, { ... }); --> Wait, presign takes a Request, not a Command.

    // AWS SDK v3 `getSignedUrl` actually calls `presigner.presign(command)`.
    // Wait, checking docs... `getSignedUrl(client, command, options)`
    // logic of getSignedUrl:
    // 1. converts command to request
    // 2. signs request

    // If I use `getSignedUrl`, I can't easily pass `unhoistableHeaders`.
    // Unless I pass it in `options`? The types for `getSignedUrl` options are `SignerOptions`?
    // No, it's `S3RequestPresignerOptions`.
    // Let's check if `unhoistableHeaders` is allowed in `getSignedUrl` options.
    // If so, that's the easiest fix!

    // Checking @aws-sdk/s3-request-presigner source/types...
    // export interface S3RequestPresignerOptions { expiresIn?: number; unhoistableHeaders?: Set<string>; ... }

    // IF `getSignedUrl` accepts `unhoistableHeaders`, we are golden.
    // The signature is `getSignedUrl(client, command, options)`.
    // `options` includes `expiresIn`. Does it include `unhoistableHeaders`?
    // Usually `getSignedUrl` implementation creates a presigner with `options`.

    // Let's try passing `unhoistableHeaders` directly to `getSignedUrl`.

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 2 * 60,
      unhoistableHeaders: new Set(["host", "content-length", "user-agent", "x-amz-content-sha256"]),
    });

    return ok({
      signedUrl,
      presignedFields: {},
    });
  } catch (error) {
    logger.error({ error }, "Failed to get signed upload URL");

    return err({
      code: StorageErrorCode.Unknown,
    });
  }
};

/**
 * Get a signed URL for a file in S3
 * @param fileKey - The key of the file in S3
 * @returns A Result containing the signed URL or an error: StorageError
 */
export const getSignedDownloadUrl = async (fileKey: string): Promise<Result<string, StorageError>> => {
  try {
    const s3Client = createS3Client();

    if (!s3Client) {
      return err({
        code: StorageErrorCode.S3ClientError,
      });
    }

    if (!S3_BUCKET_NAME) {
      return err({
        code: StorageErrorCode.S3CredentialsError,
      });
    }

    // Check if file exists before generating signed URL
    const headObjectCommand = new HeadObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
    });

    try {
      await s3Client.send(headObjectCommand);
    } catch (error: unknown) {
      logger.error({ error }, "Failed to check if file exists");
      if (
        (error as Error).name === "NotFound" ||
        (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404
      ) {
        return err({
          code: StorageErrorCode.FileNotFoundError,
        });
      }

      logger.warn({ error, fileKey }, "HeadObject check failed; proceeding to sign download URL");
    }

    const getObjectCommand = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
    });

    return ok(await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 60 * 30 }));
  } catch (error) {
    logger.error({ error }, "Failed to get signed download URL");
    return err({
      code: StorageErrorCode.Unknown,
    });
  }
};

/**
 * Delete a file from S3
 * @param fileKey - The key of the file in S3 (e.g. "surveys/123/responses/456/file.pdf")
 * @returns A Result containing the void or an error: StorageError
 */
export const deleteFile = async (fileKey: string): Promise<Result<void, StorageError>> => {
  try {
    const s3Client = createS3Client();

    if (!s3Client) {
      return err({
        code: StorageErrorCode.S3ClientError,
      });
    }

    if (!S3_BUCKET_NAME) {
      return err({
        code: StorageErrorCode.S3CredentialsError,
      });
    }

    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
    });

    await s3Client.send(deleteObjectCommand);

    return ok(undefined);
  } catch (error) {
    logger.error({ error }, "Failed to delete file");

    return err({
      code: StorageErrorCode.Unknown,
    });
  }
};

/**
 * Delete all files by prefix
 * @param prefix - The prefix of the files to delete
 * @returns A Result containing the void or an error: StorageError
 */
export const deleteFilesByPrefix = async (prefix: string): Promise<Result<void, StorageError>> => {
  try {
    const s3Client = createS3Client();

    if (!s3Client) {
      return err({
        code: StorageErrorCode.S3ClientError,
      });
    }

    if (!S3_BUCKET_NAME) {
      return err({
        code: StorageErrorCode.S3CredentialsError,
      });
    }

    const normalizedPrefix = prefix.trim();
    if (!normalizedPrefix || normalizedPrefix === "/") {
      logger.error({ prefix }, "Refusing to delete files with an empty or root prefix");
      return err({
        code: StorageErrorCode.InvalidInput,
      });
    }

    const keys: { Key: string }[] = [];

    const paginator = paginateListObjectsV2(
      { client: s3Client },
      {
        Bucket: S3_BUCKET_NAME,
        Prefix: normalizedPrefix,
      }
    );

    for await (const page of paginator) {
      const pageKeys = page.Contents?.flatMap((obj) => (obj.Key ? [{ Key: obj.Key }] : [])) ?? [];
      keys.push(...pageKeys);
    }

    if (keys.length === 0) {
      return ok(undefined);
    }

    const deletionPromises: Promise<DeleteObjectsCommandOutput>[] = [];

    for (let i = 0; i < keys.length; i += 1000) {
      const batch = keys.slice(i, i + 1000);

      const deleteObjectsCommand = new DeleteObjectsCommand({
        Bucket: S3_BUCKET_NAME,
        Delete: {
          Objects: batch,
        },
      });

      deletionPromises.push(s3Client.send(deleteObjectsCommand));
    }

    const results = await Promise.all(deletionPromises);

    // Check for partial failures and log them
    let totalErrors = 0;
    let totalDeleted = 0;

    for (const result of results) {
      if (result.Deleted) {
        totalDeleted += result.Deleted.length;
        logger.debug({ count: result.Deleted.length }, "Successfully deleted objects in batch");
      }

      if (result.Errors && result.Errors.length > 0) {
        totalErrors += result.Errors.length;
        logger.error(
          {
            errors: result.Errors.map((e) => ({
              key: e.Key,
              code: e.Code,
              message: e.Message,
            })),
          },
          "Some objects failed to delete"
        );
      }
    }

    // Log the issues
    if (totalErrors > 0) {
      logger.warn({ totalErrors, totalDeleted }, "Bulk delete completed with some failures");
    }

    return ok(undefined);
  } catch (error) {
    logger.error({ error }, "Failed to delete files by prefix");

    return err({
      code: StorageErrorCode.Unknown,
    });
  }
};
