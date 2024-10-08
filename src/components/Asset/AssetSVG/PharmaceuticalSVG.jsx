import React from "react";
import ReactDOMServer from "react-dom/server"; // Import to render to static HTML string
import ToolTip from "./ToolTip";

// interface PharmaceuticalSVGInterface {
//   svgClassName: string;
// }

function PharmaceuticalSVG({ asset_data }/* : PharmaceuticalSVGInterface*/) {
  return (
    <svg
      fill="white"
      height="100"
      width="100"
      viewBox="0 -10 100 100"
      opacity="0.8"
      className={`${asset_data.asset_id}-[${asset_data.asset_loc.x}, ${asset_data.asset_loc.y}]`}
    >
      {/* Circle */}
      <circle cx="50" cy="50" r="25" fill="#4682B4" />

      {/* Tooltip visibility toggled based on hover */}
      {<ToolTip asset_data={asset_data} />}

      <g transform="translate(30, 30) scale(0.065)">
        <g>
          <path
            d="M306.002,175.399c-3.49,0-6.815,1.483-9.143,4.079c-7.238,8.065-70.709,79.975-70.709,120.816
            c0,44.03,35.822,79.852,79.852,79.852s79.852-35.822,79.852-79.852c0-40.84-63.471-112.751-70.707-120.814
            C312.816,176.882,309.491,175.399,306.002,175.399z M255.89,291.803c0,0,4.489,15.99,22.544,34.044
            c18.055,18.055,34.042,22.546,34.042,22.546C280.074,362.372,241.375,324.432,255.89,291.803z"
          />
          <path
            d="M406.903,36.095h-32.617C360.37,13.706,338.257,0,314.358,0h-16.713c-23.899,0-46.012,13.706-59.927,36.095H205.1
            c-53.782,0-97.537,43.753-97.537,97.535v288.281c0,53.782,43.755,97.535,97.537,97.535h141.048v70.09
            c0,12.405,10.057,22.463,22.461,22.463s22.461-10.058,22.461-22.463v-70.09H406.9c53.782,0,97.537-43.753,97.537-97.535V133.631
            C504.438,79.85,460.683,36.095,406.903,36.095z M297.645,30.03h16.712c6.784,0,13.388,2.161,19.358,6.066h-55.425
            C284.259,32.19,290.863,30.03,297.645,30.03z M459.516,421.912c0,29.01-23.603,52.611-52.613,52.611H205.102
            c-29.01,0-52.613-23.601-52.613-52.611V133.631c0-29.009,23.603-52.611,52.613-52.611h201.801
            c29.01,0,52.613,23.601,52.613,52.611V421.912z"
          />
        </g>
      </g>
    </svg>
  );
}

// Create a function to render the component as an SVG string
export function renderPharmaceuticalSVG({asset_data}/* : PharmaceuticalSVGInterface*/) {
  return ReactDOMServer.renderToStaticMarkup(<PharmaceuticalSVG asset_data={asset_data} />);
}
