interface FormbricksLogoProps {
  className?: string;
}

export const FormbricksLogo = ({ className }: FormbricksLogoProps) => {
  return (
    <span className={`text-xl font-bold ${className || ""}`} style={{ color: "#1e3a5f" }}>
      CohbyForm
    </span>
  );
};
