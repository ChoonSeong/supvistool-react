import React from 'react'

// Tooltip group class for visibility control
const ToolTip = ({ asset_data }) => (
    <g className="tooltip" opacity="0">
      <rect
        x="5"
        y="-5"
        width="90"
        height="24"
        fill="#355772" // Darker shade for background
        rx="5"
        ry="5"
      />
      <text
        x="50"
        y="8"
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight={"bold"}
        fill="white"
        fontSize="15"
        cursor="default"
      >
        {`ID: ${asset_data.asset_id.length > 6 ? asset_data.asset_id.substring(0, 6) + '...' : asset_data.asset_id}`}
      </text>
    </g>
  );

export default ToolTip
