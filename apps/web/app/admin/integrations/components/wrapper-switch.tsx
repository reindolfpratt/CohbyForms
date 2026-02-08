"use client";

import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { Switch } from "@/modules/ui/components/switch";
import { toggleIntegrationAction } from "../actions";

export const WrapperSwitch = ({ type, initialValue }: { type: any; initialValue: boolean }) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  const handleCheckedChange = (checked: boolean) => {
    setIsEnabled(checked);
    startTransition(async () => {
      try {
        await toggleIntegrationAction(type, checked);
        toast.success(`${type} is now ${checked ? "Visible" : "Hidden"}`);
      } catch (e) {
        console.error(e);
        setIsEnabled(!checked); // Revert on error
        toast.error("Failed to update setting");
      }
    });
  };

  return <Switch checked={isEnabled} onCheckedChange={handleCheckedChange} disabled={isPending} />;
};
