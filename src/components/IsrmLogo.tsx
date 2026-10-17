import type { ImgHTMLAttributes } from "react";

export function IsrmLogo({
  className = "h-9 w-auto",
  style,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { showSubtitle?: boolean }) {
  return (
    <img
      src="/isrm-logo.jpg"
      alt="ISRM"
      className={className}
      style={{
        display: "inline-block",
        objectFit: "contain",
        borderRadius: "2px",
        verticalAlign: "middle",
        ...style,
      }}
      {...props}
    />
  );
}
