import { useMantineTheme } from "@mantine/core";
import React from "react";

function Icon() {
  const theme = useMantineTheme();
  const iconColor = theme.colorScheme === "dark" ? "#fff": "black";
  return (
    <>
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="33.356"
          y="40.7806"
          width="35.0148"
          height="2.5"
          transform="rotate(-135 33.356 40.7806)"
          fill={iconColor}
        />
        <rect
          x="39.0129"
          y="35.1238"
          width="35.0148"
          height="2.5"
          transform="rotate(-135 39.0129 35.1238)"
          fill={iconColor}
        />
        <rect
          x="36.1845"
          y="37.9522"
          width="35.0148"
          height="2.5"
          transform="rotate(-135 36.1845 37.9522)"
          fill={iconColor}
        />
        <rect
          x="30.3345"
          y="43.4454"
          width="25"
          height="2.5"
          transform="rotate(-135 30.3345 43.4454)"
          fill={iconColor}
        />
        <rect
          x="27.5061"
          y="46.2739"
          width="25"
          height="2.5"
          transform="rotate(-135 27.5061 46.2739)"
          fill={iconColor}
        />
        <rect
          x="24.6777"
          y="49.1023"
          width="25"
          height="2.5"
          transform="rotate(-135 24.6777 49.1023)"
          fill={iconColor}
        />
        <path
          d="M40.3345 19.4454L22.6569 1.76777L24.4246 4.14252e-06L42.1023 17.6777L40.3345 19.4454Z"
          fill={iconColor}
        />
        <rect
          x="37.5061"
          y="22.2739"
          width="25"
          height="2.5"
          transform="rotate(-135 37.5061 22.2739)"
          fill={iconColor}
        />
        <rect
          x="34.6777"
          y="25.1023"
          width="25"
          height="2.5"
          transform="rotate(-135 34.6777 25.1023)"
          fill={iconColor}
        />
      </svg>
    </>
  );
}

export default Icon;
