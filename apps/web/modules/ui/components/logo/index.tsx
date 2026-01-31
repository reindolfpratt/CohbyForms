export const Logo = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      preserveAspectRatio="xMidYMid meet"
      {...props}>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="currentColor">
        CohbyForm
      </text>
    </svg>
  );
};
