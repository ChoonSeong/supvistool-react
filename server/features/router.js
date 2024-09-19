const express = require("express");
const router = express.Router();

const gateway1Data = [
  [
    { gateway: "ac233ffb3adb", timestamp: "2024-09-03T08:57:19.356Z" },
    {
      mac: "c3000021be19",
      timestamp: "2024-09-03T08:57:19.658Z",
      rssi: -49,
      raw: "0201061aff4c000215e2c56db5dffb48d2b060d0f5a71096e000000000c5",
    },
  ],
  [
    { gateway: "ac233ffb3adb", timestamp: "2024-09-03T08:57:20.355Z" },
    {
      mac: "c3000021be19",
      timestamp: "2024-09-03T08:57:20.658Z",
      rssi: -55,
      raw: "0201061aff4c000215e2c56db5dffb48d2b060d0f5a71096e000000000c5",
    },
  ],
];

function combineGatewayData(data) {
  const combinedData = data.map((entry) => {
    const gatewayInfo = entry[0];
    const deviceInfo = entry.slice(1);

    return {
      gateway: gatewayInfo.gateway,
      devices: deviceInfo.map((device) => ({
        mac: device.mac,
        timestamp: device.timestamp,
        rssi: device.rssi,
      })),
    };
  });
  return combinedData;
}

router.get("/gateway1", (req, res) => {
  const combinedData = combineGatewayData(gateway1Data);
  res.send(combinedData);
});

module.exports = router;
