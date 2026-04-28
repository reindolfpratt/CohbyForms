-- AlterTable
ALTER TABLE "public"."Organization" ADD COLUMN "aiConfig" JSONB DEFAULT '{}';
ALTER TABLE "public"."Organization" ADD COLUMN "isAIEnabled" BOOLEAN DEFAULT false;
