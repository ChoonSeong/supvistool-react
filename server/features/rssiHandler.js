const KalmanFilter = require('kalmanjs');  // Ensure you have this installed

let rssiData = {};
const WINDOW_SIZE = 50;  // Sliding window size

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
  return rssiValues.map(rssi => kalman.filter(rssi));
}

function exponentialMovingAverage(previousEMA, newValue, smoothingFactor = 0.05) {
  return previousEMA === null ? newValue : (smoothingFactor * newValue) + ((1 - smoothingFactor) * previousEMA);
}

function extractRssiData(jsonData, gateway) {
  jsonData.forEach((entry) => {
    const tagInfo = entry[1];
    const macAddress = tagInfo.mac;
    const rssi = tagInfo.rssi;
    const timeStamp = new Date(tagInfo.timestamp).toLocaleString();

    if (!rssiData[macAddress]) {
      rssiData[macAddress] = { gateways: {}, position: { x: null, y: null } };
    }

    if (!rssiData[macAddress].gateways[gateway]) {
      rssiData[macAddress].gateways[gateway] = { rssiValues: [], filteredRssi: null, distance: null, lastUpdated: null, previousEMA: null };
    }

    const gatewayInfo = rssiData[macAddress].gateways[gateway];
    
    // Maintain a sliding window of RSSI values
    if (gatewayInfo.rssiValues.length >= WINDOW_SIZE) {
      gatewayInfo.rssiValues.shift();  // Remove the oldest value if window size is exceeded
    }

    gatewayInfo.rssiValues.push(rssi);  // Add new RSSI value to the sliding window

    // Perform filtering and averaging continuously
    let cleanedRssi = detectOutliers(gatewayInfo.rssiValues);
    let smoothedRssi = applyKalmanFilter(cleanedRssi);
    let avgRssi = calculateAverageRssi(smoothedRssi);

    // Apply Exponential Moving Average for further smoothing
    gatewayInfo.filteredRssi = exponentialMovingAverage(gatewayInfo.filteredRssi, avgRssi);
    gatewayInfo.previousEMA = gatewayInfo.filteredRssi;

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
