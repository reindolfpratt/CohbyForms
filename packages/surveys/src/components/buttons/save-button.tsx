import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  onClick: () => void;
  tabIndex?: number;
}

export function SaveButton({ onClick, tabIndex = 3 }: SaveButtonProps) {
  const { t } = useTranslation();
  return (
    <button
      dir="auto"
      tabIndex={tabIndex}
      type="button"
      className={cn(
        "hover:bg-input-bg text-heading focus:ring-focus rounded-custom focus:outline-hidden mb-1 flex items-center px-3 py-3 text-base font-medium leading-4 focus:ring-2 focus:ring-offset-2"
      )}
      onClick={onClick}>
      {t("common.save_and_continue", "Save & Continue")}
    </button>
  );
}
