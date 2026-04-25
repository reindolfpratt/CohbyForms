"use client";

import { TrashIcon } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/modules/ui/components/button";
import { DeleteDialog } from "@/modules/ui/components/delete-dialog";
import { deleteAdminUserAction } from "../actions";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAdminUserAction(userId);
      if (result.success) {
        toast.success("User deleted successfully.");
        setOpen(false);
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    });
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2">
        <TrashIcon className="h-4 w-4" />
        Delete
      </Button>

      <DeleteDialog
        open={open}
        setOpen={setOpen}
        deleteWhat={`User: ${userName}`}
        onDelete={handleDelete}
        text="Are you sure you want to delete this user? Any organizations where they are the sole owner will also be permanently deleted. This action cannot be undone."
        isDeleting={isPending}
      />
    </>
  );
}
