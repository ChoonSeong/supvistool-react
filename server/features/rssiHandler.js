const fs = require('fs');
const path = require('path');

// Temporary storage for RSSI data
let rssiData = [];
let sseClients = [];

// Store the timers to debounce multiple file change events
let fileChangeTimers = {};

// Extract RSSI, MAC, and timestamp data
function extractRssiData(jsonData, gateway) {
  jsonData.forEach((entry) => {
    const tagInfo = entry[1];
    const macAddress = tagInfo.mac;
    const rssi = tagInfo.rssi;
    const timeStamp = new Date(tagInfo.timestamp).toLocaleString();

    rssiData.push({ gateway, timeStamp, mac: macAddress, rssi });
  });
}

// Read and extract data from each file
function readAndExtractData(filePath, gateway) {
  const fullPath = path.join(__dirname, '..', 'data', filePath);
  fs.readFile(fullPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading JSON file ${fullPath}:`, err);
      return;
    }

    const jsonData = JSON.parse(data);
    extractRssiData(jsonData, gateway);
    console.log(`Data extracted from ${gateway}`);
    notifyClients();
  });
}

// Notify SSE clients
function notifyClients() {
  sseClients.forEach((client) => {
    client.write(`data: updated\n\n`);
  });
}

// Initialize reading and watching files
function initializeFileReading() {
  const filePaths = [
    { file: 'ac233fc17756_data.json', gateway: 'ac233fc17756' },
    { file: 'ac233ffb3adb_data.json', gateway: 'ac233ffb3adb' },
    { file: 'ac233ffb3adc_data.json', gateway: 'ac233ffb3adc' }
  ];

  filePaths.forEach(({ file, gateway }) => {
    const fullPath = path.join(__dirname, '..', 'data', file);
    readAndExtractData(file, gateway);

    fs.watch(fullPath, (eventType) => {
      if (eventType === 'change') {
        // Debounce file change handling to avoid repeated processing
        if (fileChangeTimers[file]) {
          clearTimeout(fileChangeTimers[file]);
        }

        fileChangeTimers[file] = setTimeout(() => {
          console.log(`${file} changed. Reloading data...`);
          rssiData = rssiData.filter((item) => item.gateway !== gateway);
          readAndExtractData(file, gateway);
        }, 100);  // Adjust the debounce delay as needed (100ms should be sufficient)
      }
    });
  });
}

// Register SSE client
function registerSSEClient(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.push(res);
  req.on('close', () => {
    sseClients = sseClients.filter(client => client !== res);
  });
}

// Retrieve stored data
function getRssiData() {
  return rssiData;
}

module.exports = { initializeFileReading, getRssiData, registerSSEClient };
