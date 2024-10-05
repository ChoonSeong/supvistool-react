const KalmanFilter = require('kalmanjs');
const { estimateDistanceForGateway } = require("./logDistance");
const { leastSquaresTrilateration } = require("./leastSquareTrilateration");

const gatewayCoordinates = {
  "ac233ffb3adc": [5.264, 0],
  "ac233fc17756": [3.15, 6.83],
  "ac233ffb3adb": [13.6, 0],
};

let rssiData = {};
const WINDOW_SIZE = 50;

// Calculates the average RSSI value from a list
function calculateAverageRssi(rssiValues) {
  if (rssiValues.length === 0) return null;
  const sum = rssiValues.reduce((acc, value) => acc + value, 0);
  return sum / rssiValues.length;
}

// Detects and removes outliers using the modified Z-score method
function detectOutliers(rssiValues) {
  const median = rssiValues.sort((a, b) => a - b)[Math.floor(rssiValues.length / 2)];
  const MAD = rssiValues.reduce((acc, val) => acc + Math.abs(val - median), 0) / rssiValues.length;
  return rssiValues.filter(rssi => {
    const modifiedZ = 0.6745 * (rssi - median) / MAD;
    return Math.abs(modifiedZ) <= 2.5;
  });
}

// Applies Kalman filter to smooth RSSI values
function applyKalmanFilter(rssiValues) {
  const kalman = new KalmanFilter({ R: 1, Q: 20 });
  return rssiValues.map(rssi => kalman.filter(rssi));
}

// Processes RSSI data for each tag in a batch
async function processRssiDataBatch(tagData) {
  for (let gateway in tagData.gateways) {
    let gatewayInfo = tagData.gateways[gateway];

    if (gatewayInfo.rssiValues.length >= WINDOW_SIZE) {
      gatewayInfo.rssiValues.splice(0, gatewayInfo.rssiValues.length - WINDOW_SIZE);
    }

    let cleanedRssi = detectOutliers(gatewayInfo.rssiValues);
    if (cleanedRssi.length === 0) continue;

    let smoothedRssi = applyKalmanFilter(cleanedRssi);
    let avgRssi = calculateAverageRssi(smoothedRssi);
    if (avgRssi === null) continue;

    gatewayInfo.distance = estimateDistanceForGateway(gateway, avgRssi);
    gatewayInfo.lastUpdated = new Date().toLocaleString();
  }

  await performTrilateration();
}

// Extracts RSSI data from JSON and processes it
function extractRssiData(jsonData) {
  jsonData.forEach((entry) => {
    const gatewayInfo = entry[0];
    const gatewayId = gatewayInfo.gateway;

    for (let i = 1; i < entry.length; i++) {
      const tagInfo = entry[i];
      const macAddress = tagInfo.mac;
      const rssi = tagInfo.rssi;

      if (!rssiData[macAddress]) {
        rssiData[macAddress] = { gateways: {}, position: { x: null, y: null } };
      }

      if (!rssiData[macAddress].gateways[gatewayId]) {
        rssiData[macAddress].gateways[gatewayId] = {
          rssiValues: [],
          distance: null,
          lastUpdated: null,
        };
      }

      const gatewayInfoForTag = rssiData[macAddress].gateways[gatewayId];
      if (gatewayInfoForTag.rssiValues.length >= WINDOW_SIZE) {
        gatewayInfoForTag.rssiValues.shift();
      }

      gatewayInfoForTag.rssiValues.push(rssi);
      gatewayInfoForTag.lastUpdated = new Date(tagInfo.timestamp).toISOString();
    }
  });

  jsonData.forEach(async (entry) => {
    for (let i = 1; i < entry.length; i++) {
      const macAddress = entry[i].mac;
      await processRssiDataBatch(rssiData[macAddress]);
    }
  });
}

// Performs trilateration to estimate position
async function performTrilateration() {
  for (const mac in rssiData) {
    const gateways = rssiData[mac].gateways;
    const gatewayCoords = [];
    const distances = [];

    for (const gatewayId in gateways) {
      if (gatewayCoordinates[gatewayId] && gateways[gatewayId].distance !== null) {
        gatewayCoords.push(gatewayCoordinates[gatewayId]);
        distances.push(gateways[gatewayId].distance);
      }
    }

    if (gatewayCoords.length >= 3 && distances.length >= 3) {
      const estimatedPosition = await leastSquaresTrilateration(gatewayCoords, distances);
      rssiData[mac].position = { x: estimatedPosition[0], y: estimatedPosition[1] };
    } else {
      rssiData[mac].position = { x: null, y: null };
    }
  }
}

function getRssiData() {
  const dataToReturn = JSON.parse(JSON.stringify(rssiData));
  for (const mac in dataToReturn) {
    const gateways = dataToReturn[mac].gateways;
    for (const gateway in gateways) {
      delete gateways[gateway].rssiValues;
    }
  }
  return dataToReturn;
}

module.exports = { extractRssiData, getRssiData };
