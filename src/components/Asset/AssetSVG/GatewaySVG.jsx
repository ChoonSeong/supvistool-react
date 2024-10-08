import React from "react";
import ReactDOMServer from "react-dom/server"; // Import to render to static HTML string
import ToolTip from "./ToolTip";

// interface GatewaySVGInterface {
//   svgClassName: string;
// }

function GatewaySVG({ asset_data } /*: GatewaySVGInterface*/) {
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
      <circle cx="50" cy="50" r="25" fill="#008080" />

      {/* Tooltip visibility toggled based on hover */}
      {<ToolTip asset_data={asset_data} />}

      {/* Consumable Shapes Group */}
      <g transform="translate(30, 31) scale(0.45)">
        <svg
          width="80px"
          height="80px"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <path
            fill="white"
            fill-rule="evenodd"
            d="M13.75.5a2.25 2.25 0 00-1.847 3.536l-.933.934a.752.752 0 00-.11.14c-.19-.071-.396-.11-.61-.11h-2.5A1.75 1.75 0 006 6.75v.5H4.372a2.25 2.25 0 100 1.5H6v.5c0 .966.784 1.75 1.75 1.75h2.5c.214 0 .42-.039.61-.11.03.05.067.097.11.14l.933.934a2.25 2.25 0 101.24-.881L12.03 9.97a.75.75 0 00-.14-.11c.071-.19.11-.396.11-.61v-2.5c0-.214-.039-.42-.11-.61a.75.75 0 00.14-.11l1.113-1.113A2.252 2.252 0 0016 2.75 2.25 2.25 0 0013.75.5zM13 2.75a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM7.75 6.5a.25.25 0 00-.25.25v2.5c0 .138.112.25.25.25h2.5a.25.25 0 00.25-.25v-2.5a.25.25 0 00-.25-.25h-2.5zm6 6a.75.75 0 100 1.5.75.75 0 000-1.5zM1.5 8A.75.75 0 113 8a.75.75 0 01-1.5 0z"
            clip-rule="evenodd"
          />
        </svg>
      </g>
    </svg>
  );
}

// Create a function to render the component as an SVG string
export function renderGatewaySVG({ asset_data } /*: GatewaySVGInterface*/) {
  return ReactDOMServer.renderToStaticMarkup(
    <GatewaySVG asset_data={asset_data} />
  );
}
