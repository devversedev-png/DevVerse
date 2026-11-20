import { useMemo } from "react";

import { makeQr } from "../utils/qr";

/* Draws a QR code as a single SVG path, so it stays sharp at any size. */
function QrCode({ value, label, className }) {
  const matrix = useMemo(() => makeQr(value), [value]);
  const quiet = 4;
  const size = matrix.length + quiet * 2;

  let path = "";

  matrix.forEach((row, y) => {
    row.forEach((dark, x) => {
      if (dark) path += `M${x + quiet} ${y + quiet}h1v1h-1z`;
    });
  });

  return (
    <svg
      className={className}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      <rect width={size} height={size} fill="#fffcf5" />
      <path d={path} fill="#2a1b12" />
    </svg>
  );
}

export default QrCode;
