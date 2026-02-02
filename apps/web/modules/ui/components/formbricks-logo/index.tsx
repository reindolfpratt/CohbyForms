import Image from "next/image";

interface FormbricksLogoProps {
  className?: string;
}

export const FormbricksLogo = ({ className }: FormbricksLogoProps) => {
  return (
    <Image src="/cohbyform-logo.png" alt="CohbyForm" width={180} height={45} className={className} priority />
  );
};
