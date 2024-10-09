const KalmanFilter = require("kalmanjs");
const { estimateDistanceForGateway } = require("./logDistance");
const { leastSquaresTrilateration } = require("./leastSquareTrilateration");

const gatewayCoordinates = {
  ac233ffb3adc: [5.264, 0],
  ac233fc17756: [3.15, 6.83],
  ac233ffb3adb: [13.6, 0],
};

let rssiData = {};
const WINDOW_SIZE = 100;

// Function to calculate the average RSSI value from a list
function calculateAverageRssi(rssiValues) {
  if (rssiValues.length === 0) return null;
  const sum = rssiValues.reduce((acc, value) => acc + value, 0);
  return sum / rssiValues.length;
}

// Function to detect and remove outliers using the modified Z-score method
function detectOutliers(rssiValues) {
  const median = rssiValues.sort((a, b) => a - b)[Math.floor(rssiValues.length / 2)];
  const MAD = rssiValues.reduce((acc, val) => acc + Math.abs(val - median), 0) / rssiValues.length;

  if (MAD === 0) {
    return rssiValues;
  }

  const filteredValues = rssiValues.filter((rssi) => {
    const modifiedZ = (0.6745 * (rssi - median)) / MAD;
    return Math.abs(modifiedZ) <= 1.5;
  });

  const removedCount = rssiValues.length - filteredValues.length;
  //console.log(`Outliers removed: ${removedCount}`);

  return filteredValues;
}

// Apply Kalman filter with fixed R and Q parameters for simplicity
function applyKalmanFilter(rssiValues) {
  const R = 15; // Fixed value for R
  const Q = 0.01; // Fixed value for Q

  const kalman = new KalmanFilter({ R, Q });

  // Apply the Kalman filter to the RSSI values
  return rssiValues.map((rssi) => kalman.filter(rssi));
}

// Process RSSI data for each tag in a batch
async function processRssiDataBatch(tagData) {
  for (let gateway in tagData.gateways) {
    let gatewayInfo = tagData.gateways[gateway];

    // Check if RSSI values exist
    if (!gatewayInfo.rssiValues || gatewayInfo.rssiValues.length === 0) {
      continue; 
    }

    // Take the most recent 10 RSSI values for outlier detection
    const recentRssiValues = gatewayInfo.rssiValues.slice(-10);

    // Perform outlier detection
    const cleanedRssi = detectOutliers(recentRssiValues);
    if (!cleanedRssi || cleanedRssi.length === 0) {
      continue; 
    }

    // Replace the last 10 values with cleaned RSSI values
    gatewayInfo.rssiValues.splice(-10, 10, ...cleanedRssi);

    // Apply Kalman filter to the cleaned RSSI values
    const smoothedRssi = applyKalmanFilter(gatewayInfo.rssiValues);
    if (!smoothedRssi || smoothedRssi.length === 0) {
      continue; 
    }

    // Calculate average smoothed RSSI
    const avgRssi = calculateAverageRssi(smoothedRssi);
    if (avgRssi === null) continue;

    // Update the filtered RSSI and distance
    gatewayInfo.prevFilteredRSSI = avgRssi;
    gatewayInfo.filteredRSSI = avgRssi;
    gatewayInfo.distance = estimateDistanceForGateway(gateway, avgRssi);
    gatewayInfo.lastUpdated = new Date().toLocaleString();
  }

  await performTrilateration();
}

// Extract RSSI data from JSON and process it
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
          filteredRSSI: null,
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

// Returns the RSSI data with filteredRSSI, distance, and lastUpdated fields
function getRssiData() {
  const dataToReturn = JSON.parse(JSON.stringify(rssiData));
  return dataToReturn;
}

module.exports = { extractRssiData, getRssiData };
