import React, { useState } from "react";
import ReactDOMServer from "react-dom/server"; // For static markup rendering

// SVG component
function FixtureSVG() {
  return (
    <svg
      fill="white"
      width="50"
      height="50"
      viewBox="-100 -100 200 200"
      opacity="0.8"
    >
      <circle cx="0" cy="0" r="100" fill="#4682B4" />
      <g transform="translate(-65, -70) scale(5)">
        <path d="M25,16H17a2.0023,2.0023,0,0,0-2,2v6H4V14H2V30H4V26H28v4h2V21A5.0059,5.0059,0,0,0,25,16Zm3,8H17V18h8a3.0033,3.0033,0,0,1,3,3Z" />
        <path d="M9.5,17A1.5,1.5,0,1,1,8,18.5,1.5017,1.5017,0,0,1,9.5,17m0-2A3.5,3.5,0,1,0,13,18.5,3.5,3.5,0,0,0,9.5,15Z" />
        <polygon points="21 6 17 6 17 2 15 2 15 6 11 6 11 8 15 8 15 12 17 12 17 8 21 8 21 6" />
      </g>
      <rect fill="none" width="32" height="32" />
    </svg>
  );
}

// Function to render as an SVG string
export function renderFixtureSVG(props: {}) {
  return ReactDOMServer.renderToStaticMarkup(<FixtureSVG {...props} />);
}