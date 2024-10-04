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

function calculateAverageRssi(rssiValues) {
  if (rssiValues.length === 0) return null;
  const sum = rssiValues.reduce((acc, value) => acc + value, 0);
  return sum / rssiValues.length;
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
      rssiData[macAddress].gateways[gateway] = { rssiValues: [], averageRssi: null, distance: null, lastUpdated: null };
    }

    const gatewayInfo = rssiData[macAddress].gateways[gateway];
    gatewayInfo.rssiValues.push(rssi);

    if (gatewayInfo.rssiValues.length > 100) {
      gatewayInfo.rssiValues.shift();
    }

    gatewayInfo.averageRssi = calculateAverageRssi(gatewayInfo.rssiValues);
    gatewayInfo.distance = estimateDistanceForGateway(gateway, gatewayInfo.averageRssi);
    gatewayInfo.lastUpdated = timeStamp;
  });

  // Perform trilateration after updating RSSI data
  performTrilateration();
}

function performTrilateration() {
  for (const mac in rssiData) {
    const gateways = rssiData[mac].gateways;

    // Prepare gateways and distances arrays for trilateration
    const gatewayCoords = [];
    const distances = [];

    for (const gatewayId in gateways) {
      if (gatewayCoordinates[gatewayId]) {
        gatewayCoords.push(gatewayCoordinates[gatewayId]);    // Push gateway coordinates [x, y]
        distances.push(gateways[gatewayId].distance);         // Push the calculated distance
      }
    }

    if (gatewayCoords.length >= 3 && distances.length >= 3) { // Need at least 3 gateways for trilateration
      const estimatedPosition = leastSquaresTrilateration(gatewayCoords, distances);
      rssiData[mac].position = { x: estimatedPosition[0], y: estimatedPosition[1] };
    } else {
      rssiData[mac].position = { x: null, y: null };  // Insufficient data for trilateration
    }
  }
}

function getRssiData() {
  const dataToReturn = JSON.parse(JSON.stringify(rssiData));

  for (const mac in dataToReturn) {
    const gateways = dataToReturn[mac].gateways;

    // Log just the tag (mac address) without the timestamp
    console.log(`Tag ${mac} updated.`);

    // Remove raw RSSI values from the data before returning
    for (const gateway in gateways) {
      delete gateways[gateway].rssiValues;
    }
  }

  return dataToReturn;
}

module.exports = { extractRssiData, getRssiData };
