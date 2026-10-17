import type { SVGProps } from "react";

export function IsrmLogo({
  className = "h-8 w-auto",
  showSubtitle = true,
  ...props
}: SVGProps<SVGSVGElement> & { showSubtitle?: boolean }) {
  return (
    <svg
      viewBox={showSubtitle ? "0 0 240 44" : "0 0 110 36"}
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ISRM — The Institute of Strategic Risk Management"
      {...props}
    >
      {/* Lettermark: ISRM */}
      <g className="font-display font-extrabold tracking-wider">
        {/* I */}
        <rect x="2" y="6" width="6.5" height="24" rx="1" fill="currentColor" />
        
        {/* S */}
        <path
          d="M 33 11 C 32 7.5 28.5 6 23.5 6 C 17.5 6 14 9.5 14 13.5 C 14 20.5 33 18 33 26.5 C 33 30.5 29.5 34 23.5 34 C 17 34 13.5 30 13 26 L 19 25 C 19.5 27.5 21 28.8 23.5 28.8 C 26 28.8 27.2 27.5 27.2 26 C 27.2 20 8.5 21.5 8.5 13.5 C 8.5 8 13.5 6 23.5 6 C 30 6 32 9.5 33 11 Z"
          fill="currentColor"
        />

        {/* R */}
        <path
          d="M 38 6 L 50 6 C 55 6 58 8.5 58 13 C 58 16.5 55.5 19 51.5 19.5 L 59 30 L 52 30 L 45.2 20 L 44 20 L 44 30 L 38 30 Z M 44 11 L 44 15.5 L 49.5 15.5 C 51.5 15.5 52.5 14.5 52.5 13.2 C 52.5 12 51.5 11 49.5 11 Z"
          fill="currentColor"
        />

        {/* M */}
        <path
          d="M 64 6 L 71 6 L 77.5 21 L 84 6 L 91 6 L 91 30 L 85.5 30 L 85.5 13.5 L 79.5 27 L 75.5 27 L 69.5 13.5 L 69.5 30 L 64 30 Z"
          fill="currentColor"
        />
      </g>

      {/* Gold brand accent bar under ISRM */}
      <rect x="2" y="34.5" width="89" height="2" rx="1" fill="var(--primary, #e2b357)" />

      {/* Optional official sub-title: Institute of Strategic Risk Management */}
      {showSubtitle && (
        <g className="text-muted-foreground opacity-90">
          <text
            x="102"
            y="15"
            fontFamily="'Space Grotesk', system-ui, sans-serif"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="1.2px"
            fill="currentColor"
          >
            INSTITUTE OF
          </text>
          <text
            x="102"
            y="25"
            fontFamily="'Space Grotesk', system-ui, sans-serif"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="1.2px"
            fill="currentColor"
          >
            STRATEGIC RISK
          </text>
          <text
            x="102"
            y="35"
            fontFamily="'Space Grotesk', system-ui, sans-serif"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="1.2px"
            fill="var(--primary, #e2b357)"
          >
            MANAGEMENT
          </text>
        </g>
      )}
    </svg>
  );
}
