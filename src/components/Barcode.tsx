import React from "react";

interface BarcodeProps {
  id: string;
  vertical?: boolean;
  width?: number;
  height?: number;
  linesCount?: number;
}

export default function Barcode({ id, vertical = false, width = 120, height = 24, linesCount = 42 }: BarcodeProps) {
  // Generate pseudo-random deterministic lines for the barcode based on linesCount
  // We want to alternate between space and line with varying weights [1, 2, 3, 4]
  const renderLines = () => {
    const rects: any[] = [];
    let currentX = 0;
    
    // Deterministic sequence based on linesCount to ensure consistency but look varied
    for (let i = 0; i < linesCount; i++) {
      const isLine = i % 2 === 0;
      // Varying widths (1px to 4px)
      const seed = (i * 7 + 13) % 10;
      let lineW = 1;
      if (seed < 4) lineW = 1;
      else if (seed < 7) lineW = 2;
      else if (seed < 9) lineW = 3;
      else lineW = 4;
      
      const gapW = ((i * 3 + 29) % 4) + 1; // 1px to 4px spacing
      
      if (isLine) {
        rects.push(
          <rect
            key={`bar-${i}`}
            x={currentX}
            y={0}
            width={lineW}
            height={height}
            fill="currentColor"
          />
        );
        currentX += lineW;
      } else {
        currentX += gapW;
      }
    }
    
    return { rects, totalWidth: currentX };
  };

  const { rects, totalWidth } = renderLines();

  if (vertical) {
    return (
      <div id={id} className="inline-block" style={{ transform: "rotate(-90deg)", transformOrigin: "bottom left" }}>
        <svg
          width={height} // Swap width/height for vertical orientation
          height={totalWidth}
          viewBox={`0 0 ${height} ${totalWidth}`}
          className="text-neutral-900 opacity-80"
        >
          <g transform={`rotate(90, 0, 0) translate(0, -${height})`}>
            {rects}
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div id={id} className="inline-block overflow-hidden">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${totalWidth} ${height}`}
        preserveAspectRatio="none"
        className="text-neutral-950 opacity-80"
      >
        <g>{rects}</g>
      </svg>
    </div>
  );
}
