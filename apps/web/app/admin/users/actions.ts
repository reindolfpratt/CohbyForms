"use server";

import { revalidatePath } from "next/cache";
import { verifySuperAdmin } from "@/app/admin/actions";
import { deleteUser } from "@/lib/user/service";

export async function deleteAdminUserAction(userId: string) {
  try {
    await verifySuperAdmin();
    await deleteUser(userId);
    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return { success: false, message: error.message || "Failed to delete user" };
  }
}
