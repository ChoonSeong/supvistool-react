const KalmanFilter = require('kalmanjs');  // Ensure you have this installed

let rssiData = {};
const WINDOW_SIZE = 50;  // Sliding window size
const DETECTION_INTERVAL = 20;  // Run outlier detection after 20 new data points

function calculateAverageRssi(rssiValues) {
  if (rssiValues.length === 0) return null;
  const sum = rssiValues.reduce((acc, value) => acc + value, 0);
  return sum / rssiValues.length;
}

function detectOutliers(rssiValues) {
  const median = rssiValues.sort((a, b) => a - b)[Math.floor(rssiValues.length / 2)];
  const MAD = rssiValues.reduce((acc, val) => acc + Math.abs(val - median), 0) / rssiValues.length;

  return rssiValues.filter(rssi => {
    const modifiedZ = 0.6745 * (rssi - median) / MAD;
    return Math.abs(modifiedZ) <= 2.5;  // Aggressive outlier detection
  });
}

function applyKalmanFilter(rssiValues) {
  const kalman = new KalmanFilter({ R: 1, Q: 20 });  // Adjusted Kalman filter for more smoothing
  // Apply the Kalman filter to the full sliding window or the last WINDOW_SIZE values
  return rssiValues.map(rssi => kalman.filter(rssi));
}

function adaptiveExponentialMovingAverage(previousEMA, newValue, smoothingFactor = 0.05) {
  // Adaptive smoothing factor based on the fluctuation in RSSI
  const fluctuation = Math.abs(newValue - previousEMA);
  const adjustedSmoothingFactor = fluctuation > 5 ? 0.1 : 0.05; // Example: if fluctuation > 5, increase smoothing

  return previousEMA === null ? newValue : (adjustedSmoothingFactor * newValue) + ((1 - adjustedSmoothingFactor) * previousEMA);
}

function extractRssiData(jsonData, gateway) {
  jsonData.forEach((entry) => {
    const tagInfo = entry[1];
    const macAddress = tagInfo.mac;
    const rssi = tagInfo.rssi;
    const timeStamp = new Date(tagInfo.timestamp).toLocaleString();

    if (!rssiData[macAddress]) {
      rssiData[macAddress] = { gateways: {}, position: { x: null, y: null }, dataCount: 0 }; // Added dataCount
    }

    if (!rssiData[macAddress].gateways[gateway]) {
      rssiData[macAddress].gateways[gateway] = { rssiValues: [], filteredRssi: null, distance: null, lastUpdated: null, previousEMA: null };
    }

    const gatewayInfo = rssiData[macAddress].gateways[gateway];
    const macInfo = rssiData[macAddress];
    
    // Maintain a sliding window of RSSI values
    if (gatewayInfo.rssiValues.length >= WINDOW_SIZE) {
      gatewayInfo.rssiValues.shift();  // Remove the oldest value if window size is exceeded
    }

    gatewayInfo.rssiValues.push(rssi);  // Add new RSSI value to the sliding window
    macInfo.dataCount++;  // Increment data count for the tag

    // More frequent filtering and outlier detection every 20 new data points
    if (macInfo.dataCount >= DETECTION_INTERVAL) {
      // Perform outlier detection and Kalman filtering on the entire window
      let cleanedRssi = detectOutliers(gatewayInfo.rssiValues);
      let smoothedRssi = applyKalmanFilter(cleanedRssi);  // Filter the entire sliding window
      let avgRssi = calculateAverageRssi(smoothedRssi);  // Average the filtered values

      // Apply adaptive Exponential Moving Average for further smoothing
      gatewayInfo.filteredRssi = adaptiveExponentialMovingAverage(gatewayInfo.filteredRssi, avgRssi);
      gatewayInfo.previousEMA = gatewayInfo.filteredRssi;

      // Reset the data count after running the outlier detection and filtering
      macInfo.dataCount = 0;
    }

    gatewayInfo.lastUpdated = timeStamp;
  });
}

function getRssiData() {
  const dataToReturn = JSON.parse(JSON.stringify(rssiData));

  for (const mac in dataToReturn) {
    const gateways = dataToReturn[mac].gateways;
    console.log(`Tag ${mac} updated.`);
    for (const gateway in gateways) {
      delete gateways[gateway].rssiValues;  // Remove raw RSSI values for clean output
    }
  }

  return dataToReturn;
}

module.exports = { extractRssiData, getRssiData };
