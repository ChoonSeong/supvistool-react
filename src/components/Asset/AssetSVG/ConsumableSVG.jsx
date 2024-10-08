import React from "react";
import ReactDOMServer from "react-dom/server"; // Import to render to static HTML string
import ToolTip from "./ToolTip";

// interface ConsumableSVGInterface {
//   svgClassName: string;
// }

function ConsumableSVG({ asset_data }/* : ConsumableSVGInterface*/) {
  return (
    <svg
      fill="white"
      width="100"
      height="100"
      viewBox="0 -10 100 100"
      opacity="0.8"
      className={`${asset_data.asset_id}-[${asset_data.asset_loc.x}, ${asset_data.asset_loc.y}]`}
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="25" fill="#4682B4" />

      {/* Tooltip visibility toggled based on hover */}
      {<ToolTip asset_data={asset_data} />}

      {/* Consumable Shapes Group */}
      <g transform="translate(32, 32) scale(0.07)">
        {/* First Rectangle */}
        <rect
          x="-24.43"
          y="167.88"
          width="560.87"
          height="176.25"
          rx="88.12"
          ry="88.12"
          transform="translate(-106.04 256) rotate(-45)"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32px"
        />

        {/* Second Rectangle */}
        <rect
          x="169.41"
          y="156.59"
          width="176"
          height="196"
          rx="32"
          ry="32"
          transform="translate(255.41 -107.45) rotate(45)"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32px"
        />

        {/* Circles */}
        <circle cx="256" cy="208" r="16" fill="white" />
        <circle cx="304" cy="256" r="16" fill="white" />
        <circle cx="208" cy="256" r="16" fill="white" />
        <circle cx="256" cy="304" r="16" fill="white" />
      </g>
    </svg>
  );
}

// Create a function to render the component as an SVG string
export function renderConsumableSVG({asset_data} /*: ConsumableSVGInterface*/) {
  return ReactDOMServer.renderToStaticMarkup(<ConsumableSVG asset_data={asset_data} />);
}
