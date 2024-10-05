const KalmanFilter = require('kalmanjs');  // Ensure you have this installed

const { estimateDistanceForGateway } = require("./logDistance");
const { leastSquaresTrilateration } = require("./leastSquareTrilateration");

// Predefined coordinates of gateways (e.g., (x, y) positions)
const gatewayCoordinates = {
  "ac233ffb3adc": [5.264, 0], // Gateway 1 position
  "ac233fc17756": [3.15, 6.83], // Gateway 2 position
  "ac233ffb3adb": [13.6, 0],  // Gateway 3 position
};

// Focuses on processing RSSI data
let rssiData = {};
const WINDOW_SIZE = 50;  // Sliding window size

function calculateAverageRssi(rssiValues) {
  if (rssiValues.length === 0) return null;
  const sum = rssiValues.reduce((acc, value) => acc + value, 0);
  return sum / rssiValues.length;
}

function detectOutliers(rssiValues) {
  if (rssiValues.length === 0) return [];
  const median = rssiValues.sort((a, b) => a - b)[Math.floor(rssiValues.length / 2)];
  const MAD = rssiValues.reduce((acc, val) => acc + Math.abs(val - median), 0) / rssiValues.length;

  return rssiValues.filter(rssi => {
    const modifiedZ = 0.6745 * (rssi - median) / MAD;
    return Math.abs(modifiedZ) <= 2.5;  // Outlier detection
  });
}

function applyKalmanFilter(rssiValues) {
  const kalman = new KalmanFilter({ R: 1, Q: 20 });  // Adjusted Kalman filter for more smoothing
  // Apply the Kalman filter to all RSSI values in the window
  return rssiValues.map(rssi => kalman.filter(rssi));
}


async function processRssiDataBatch(tagData) {
  for (let gateway in tagData.gateways) {
    let gatewayInfo = tagData.gateways[gateway];

    // Maintain a sliding window of RSSI values
    if (gatewayInfo.rssiValues.length >= WINDOW_SIZE) {
      gatewayInfo.rssiValues.splice(0, gatewayInfo.rssiValues.length - WINDOW_SIZE);
    }

    // Run outlier detection and Kalman filtering on the batch of RSSI values
    let cleanedRssi = detectOutliers(gatewayInfo.rssiValues);
    if (cleanedRssi.length === 0) {
      console.warn(`No valid RSSI data after outlier detection for gateway ${gateway}`);
      continue;
    }

    let smoothedRssi = applyKalmanFilter(cleanedRssi);
    let avgRssi = calculateAverageRssi(smoothedRssi);
    if (avgRssi === null) {
      console.warn(`No valid RSSI data after Kalman filtering for gateway ${gateway}`);
      continue;
    }

    gatewayInfo.filteredRssi = avgRssi

    if (gatewayInfo.filteredRssi !== null) {
      gatewayInfo.distance = estimateDistanceForGateway(gateway, gatewayInfo.filteredRssi);
    } else {
      console.warn(`Skipping distance calculation for gateway ${gateway} due to null filteredRssi`);
      continue;
    }

    gatewayInfo.lastUpdated = new Date().toLocaleString();
  }

  // Perform trilateration after batch processing
  await performTrilateration();
}

function extractRssiData(jsonData) {
  // First loop: Store RSSI data for each gateway and its associated tags
  jsonData.forEach((entry) => {
    const gatewayInfo = entry[0];  // The first element is the gateway info
    const gatewayId = gatewayInfo.gateway;  // Extract the gateway ID

    console.log(`Processing data from gateway: ${gatewayId}`);

    // Iterate over the remaining elements, which are the tag readings
    for (let i = 1; i < entry.length; i++) {
      const tagInfo = entry[i];  // Extract each tag's info
      const macAddress = tagInfo.mac;
      const rssi = tagInfo.rssi;

      // Initialize the storage for the tag if it doesn't exist
      if (!rssiData[macAddress]) {
        rssiData[macAddress] = { gateways: {}, position: { x: null, y: null } };
      }

      // Initialize the gateway-specific info for this tag
      if (!rssiData[macAddress].gateways[gatewayId]) {
        rssiData[macAddress].gateways[gatewayId] = {
          rssiValues: [],
          filteredRssi: null,
          distance: null,
          lastUpdated: null,
        };
      }

      const gatewayInfoForTag = rssiData[macAddress].gateways[gatewayId];

      // Maintain a sliding window of RSSI values (use shift to remove the oldest value)
      if (gatewayInfoForTag.rssiValues.length >= WINDOW_SIZE) {
        gatewayInfoForTag.rssiValues.shift();  // Remove the oldest RSSI value
      }

      // Add new RSSI value to the sliding window
      gatewayInfoForTag.rssiValues.push(rssi);

      // Update the lastUpdated timestamp
      gatewayInfoForTag.lastUpdated = new Date(tagInfo.timestamp).toISOString();

      // Optional: Logging every 10 tags for debugging (can be removed in production)
      if (i % 10 === 0 || i === entry.length - 1) {
        console.log(`Updated tag ${macAddress} from gateway ${gatewayId} with RSSI: ${rssi}`);
      }
    }
  });

  // Second loop: Process RSSI data for each tag asynchronously
  jsonData.forEach(async (entry) => {
    // Iterate over the tag readings (skip the first element which is gateway info)
    for (let i = 1; i < entry.length; i++) {
      const macAddress = entry[i].mac;

      // Process each tag's RSSI data asynchronously using a batch processor
      await processRssiDataBatch(rssiData[macAddress]);
    }
  });
}



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
      console.warn(`Insufficient data for trilateration for tag ${mac}`);
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