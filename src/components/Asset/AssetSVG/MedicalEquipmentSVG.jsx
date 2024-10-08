import React from "react";
import ReactDOMServer from "react-dom/server"; // Import to render to static HTML string
import ToolTip from "./ToolTip";

// interface MedicalEquipmentSVGInterface {
//   svgClassName: string;
// }

function MedicalEquipmentSVG(
  { asset_data } /* : MedicalEquipmentSVGInterface*/
) {
  return (
    <>
      <svg
        fill="white"
        viewBox="0 -10 100 100"
        width="100"
        height="100"
        opacity="0.8"
        className={`${asset_data.asset_id}-[${asset_data.asset_loc.x}, ${asset_data.asset_loc.y}]`}
      >

        <circle cx="50" cy="50" r="25" fill="#4682B4" />

      {/* Tooltip visibility toggled based on hover */}
      {<ToolTip asset_data={asset_data} />}

        <g transform="translate(30, 29) scale(0.2)">
          <path
            d="M171.481,30.562H21.853C9.803,30.562,0,40.365,0,52.414v88.505c0,12.049,9.803,21.853,21.853,21.853h149.628
        c12.049,0,21.853-9.803,21.853-21.853V52.414C193.333,40.365,183.53,30.562,171.481,30.562z M183.333,140.919
        c0,6.536-5.317,11.853-11.853,11.853H21.853c-6.536,0-11.853-5.317-11.853-11.853V52.414c0-6.535,5.317-11.852,11.853-11.852
        h149.628c6.536,0,11.853,5.317,11.853,11.852V140.919z"
          />
          <rect x="151.667" y="115.895" width="19" height="10" />
          <rect x="151.667" y="96.667" width="19" height="10" />
          <rect x="151.667" y="77.438" width="19" height="10" />
          <path
            d="M115.084,53.833H45.166c-11.166,0-20.25,9.083-20.25,20.249v43.703c0,11.166,9.084,20.25,20.25,20.25h69.918
        c11.166,0,20.25-9.084,20.25-20.25V74.082C135.333,62.917,126.25,53.833,115.084,53.833z M45.166,63.833h69.918
        c5.651,0,10.25,4.598,10.25,10.249v18.852h-23.739c-1.123,0-2.151,0.626-2.666,1.624l-1.538,2.978V81.981
        c0-1.384-0.947-2.588-2.292-2.915c-1.346-0.328-2.739,0.309-3.374,1.539l-6.365,12.329h-5.125c-1.123,0-2.151,0.626-2.666,1.624
        l-1.538,2.978V81.981c0-1.384-0.947-2.588-2.292-2.915c-1.346-0.328-2.739,0.309-3.374,1.539l-6.365,12.329H34.917V74.082
        C34.917,68.431,39.515,63.833,45.166,63.833z M115.084,128.034H45.166c-5.651,0-10.25-4.598-10.25-10.25V98.934h30.913
        c1.123,0,2.151-0.626,2.666-1.624l1.538-2.979v15.555c0,1.384,0.947,2.588,2.292,2.915c1.344,0.327,2.739-0.309,3.374-1.539
        l6.365-12.329h5.125c1.123,0,2.151-0.626,2.666-1.624l1.538-2.979v15.555c0,1.384,0.947,2.588,2.292,2.915
        c0.236,0.058,0.474,0.085,0.708,0.085c1.103,0,2.142-0.61,2.665-1.625l6.365-12.329h21.911v18.851
        C125.333,123.436,120.735,128.034,115.084,128.034z"
          />
        </g>
      </svg>
    </>
  );
}

// Create a function to render the component as an SVG string
export function renderMedicalEquipmentSVG(
  { asset_data } /* : MedicalEquipmentSVGInterface*/
) {
  return ReactDOMServer.renderToStaticMarkup(
    <MedicalEquipmentSVG asset_data={asset_data} />
  );
}
