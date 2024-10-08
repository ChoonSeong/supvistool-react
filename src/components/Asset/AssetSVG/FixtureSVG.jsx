import React from "react";
import ReactDOMServer from "react-dom/server"; // For static markup rendering
import ToolTip from "./ToolTip";

// interface FixtureSVGInterface {
//   svgClassName: string;
// }

// SVG component
function FixtureSVG({ asset_data } /*: FixtureSVGInterface*/) {
  return (
    <svg
      fill="white"
      width="100"
      height="100"
      viewBox="0 -10 100 100"
      opacity="0.8"
      className={`${asset_data.asset_id}-[${asset_data.asset_loc.x}, ${asset_data.asset_loc.y}]`}
    >
      
      <circle cx="50" cy="50" r="25" fill="#4682B4" />

      {/* Tooltip visibility toggled based on hover */}
      {<ToolTip asset_data={asset_data} />}

      <g transform="translate(30, 28) scale(1.2)">
        <path d="M25,16H17a2.0023,2.0023,0,0,0-2,2v6H4V14H2V30H4V26H28v4h2V21A5.0059,5.0059,0,0,0,25,16Zm3,8H17V18h8a3.0033,3.0033,0,0,1,3,3Z" />
        <path d="M9.5,17A1.5,1.5,0,1,1,8,18.5,1.5017,1.5017,0,0,1,9.5,17m0-2A3.5,3.5,0,1,0,13,18.5,3.5,3.5,0,0,0,9.5,15Z" />
        <polygon points="21 6 17 6 17 2 15 2 15 6 11 6 11 8 15 8 15 12 17 12 17 8 21 8 21 6" />
      </g>
      <rect fill="none" width="32" height="32" />
    </svg>
  );
}

// Function to render as an SVG string
export function renderFixtureSVG({asset_data} /*: FixtureSVGInterface*/) {
  return ReactDOMServer.renderToStaticMarkup(<FixtureSVG asset_data={asset_data} />);
}