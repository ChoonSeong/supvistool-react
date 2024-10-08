const KalmanFilter = require('kalmanjs');
const { estimateDistanceForGateway } = require("./logDistance");
const { leastSquaresTrilateration } = require("./leastSquareTrilateration");

const gatewayCoordinates = {
  "ac233ffb3adc": [5.264, 0],
  "ac233fc17756": [3.15, 6.83],
  "ac233ffb3adb": [13.6, 0],
};

let rssiData = {};
const WINDOW_SIZE = 100;
const OUTLIER_DETECTION_INTERVAL = 10; // Run outlier detection every 10 data

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

  // Keep track of the original length and filtered values
  const filteredValues = rssiValues.filter(rssi => {
    const modifiedZ = 0.6745 * (rssi - median) / MAD;
    return Math.abs(modifiedZ) <= 1.5;
  });

  // Calculate the number of removed outliers
  const removedCount = rssiValues.length - filteredValues.length;

  // Log the number of removed outliers
  console.log(`Outliers removed: ${removedCount}`);

  return filteredValues;
}

// Applies a more conservative adaptive Kalman filter for RSSI smoothing
function applyDynamicKalmanFilter(rssiValues, gatewayInfo) {
  const meanRssi = calculateAverageRssi(rssiValues);
  const variance = rssiValues.reduce((acc, rssi) => acc + Math.pow(rssi - meanRssi, 2), 0) / rssiValues.length;

  // Make the filter more conservative by increasing R when variance is low
  let R = Math.max(variance / 10, 1);  // Slightly higher R for more resistance to noise

  // Adjust Q to make the filter less responsive to small fluctuations
  const recentRSSIChange = Math.abs(gatewayInfo.prevFilteredRSSI - gatewayInfo.filteredRSSI || 0);
  
  // Use a more aggressive adjustment for Q when there are no significant distance changes
  let Q = recentRSSIChange > 2 ? 30 : 3;  // Reduced Q for smoother response

  // Further reduce Q when variance is very low to stabilize quickly
  if (variance < 3) {
    Q = Math.max(Q / 3, 1);  // Lower Q even more for smoother results when variance is low
  }

  // Ensure Q doesn't drop too low, which would make the filter too rigid
  Q = Math.max(Q, 2);  // Set a minimum Q to prevent over-smoothing

  R = 6
  Q = 1

  const kalman = new KalmanFilter({ R, Q });
  //console.log("before : " + rssiValues);
  // Apply the Kalman filter to each RSSI value in the window
  return rssiValues.map(rssi => kalman.filter(rssi));
  //return rssiValues;
}


// Processes RSSI data for each tag in a batch
async function processRssiDataBatch(tagData) {
  for (let gateway in tagData.gateways) {
    let gatewayInfo = tagData.gateways[gateway];

    // Log current sliding window before update
    //console.log(`Before sliding window update for gateway ${gateway}: `, gatewayInfo.rssiValues);

    // Only take the 10 most recent RSSI values for outlier detection
    const recentRssiValues = gatewayInfo.rssiValues.slice(-10);

    // Perform outlier detection on these 10 values
    const cleanedRssi = detectOutliers(recentRssiValues);

    //console.log(`Outlier detection for gateway ${gateway}: `, cleanedRssi);

    if (cleanedRssi.length === 0) continue; // Skip if no valid RSSI data after outlier detection

    // Update the sliding window by removing the old values and adding the new cleaned RSSI values
    const remainingWindowSpace = WINDOW_SIZE - gatewayInfo.rssiValues.length;
    if (remainingWindowSpace < cleanedRssi.length) {
      //console.log(`Shifting sliding window for gateway ${gateway}. Removing ${cleanedRssi.length - remainingWindowSpace} values.`);
      gatewayInfo.rssiValues.splice(0, cleanedRssi.length - remainingWindowSpace); // Remove oldest data
    }
    gatewayInfo.rssiValues.push(...cleanedRssi); // Add cleaned RSSI values to the sliding window

    // Log updated sliding window
    //console.log(`After sliding window update for gateway ${gateway}: `, gatewayInfo.rssiValues);

    // Apply Kalman filter to the entire sliding window
    const smoothedRssi = applyDynamicKalmanFilter(gatewayInfo.rssiValues, gatewayInfo);
    //console.log(`Smoothed RSSI values for gateway ${gateway}: `, smoothedRssi);

    // Calculate the average of the filtered values
    const avgRssi = calculateAverageRssi(smoothedRssi);
    if (avgRssi === null) continue;

    // Update the filtered RSSI and distance
    gatewayInfo.prevFilteredRSSI = gatewayInfo.filteredRSSI;
    gatewayInfo.filteredRSSI = avgRssi;
    gatewayInfo.distance = estimateDistanceForGateway(gateway, gatewayInfo.filteredRSSI);
    gatewayInfo.lastUpdated = new Date().toLocaleString();

    // Log the final filtered RSSI and distance
    //console.log(`Final filtered RSSI for gateway ${gateway}: ${avgRssi}, Distance: ${gatewayInfo.distance}`);
  }

  await performTrilateration(); // Perform trilateration after updating all tag data
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
          filteredRSSI: null,
          distance: null,
          lastUpdated: null,
          prevFilteredRSSI: null,
          counter: 0,  // Initialize a counter for outlier detection
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

// Returns the RSSI data with filteredRSSI, distance, previousDistance, and lastUpdated fields
function getRssiData() {
  const dataToReturn = JSON.parse(JSON.stringify(rssiData));

  for (const mac in dataToReturn) {
    const gateways = dataToReturn[mac].gateways;
    for (const gateway in gateways) {
      delete gateways[gateway].rssiValues; // Remove rssiValues but keep filteredRSSI, distance, etc.
    }
  }

  return dataToReturn;
}

module.exports = { extractRssiData, getRssiData };
