import { KeyIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/modules/ui/components/button";

export type ModalButton = {
  text: string;
  href?: string;
  onClick?: () => void;
};

interface UpgradePromptProps {
  title: string;
  description?: string;
  buttons?: ModalButton[];
}

export const UpgradePrompt = ({ title, description, buttons = [] }: UpgradePromptProps) => {
  return (
    <div className="flex w-full flex-col items-center gap-6 p-6">
      <div className="rounded-md border border-slate-200 p-3">
        <KeyIcon className="h-6 w-6 text-slate-900" />
      </div>
      <div className="flex max-w-[80%] flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      {buttons.length > 0 && (
        <div className="flex gap-3">
          {buttons.map((button, index) => {
            const variant = index === 0 ? "default" : "secondary";

            if (button.href) {
              return (
                <Button key={index} variant={variant} asChild>
                  <Link href={button.href} target="_blank" rel="noopener noreferrer">
                    {button.text}
                  </Link>
                </Button>
              );
            }

            return (
              <Button key={index} variant={variant} onClick={button.onClick}>
                {button.text}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};
