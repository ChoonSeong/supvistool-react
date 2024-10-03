const { estimateDistanceForGateway } = require("./logDistance");

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
}

function getRssiData() {
  const dataToReturn = JSON.parse(JSON.stringify(rssiData));

  for (const mac in dataToReturn) {
    // Retrieve each tag's gateways
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
