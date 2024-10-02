// This file handles reading and watching data files

const path = require('path');
const fs = require('fs');
const rssiHandler = require('./rssiHandler');
const sseHandler = require('./sseHandler');

function readAndWatchFiles() {
  const filePaths = [
    { file: 'ac233fc17756_data.json', gateway: 'ac233fc17756' },
    { file: 'ac233ffb3adb_data.json', gateway: 'ac233ffb3adb' },
    { file: 'ac233ffb3adc_data.json', gateway: 'ac233ffb3adc' },
  ];

  filePaths.forEach(({ file, gateway }) => {
    const fullPath = path.join(__dirname, '..', 'data', file);
    fs.readFile(fullPath, 'utf8', (err, data) => {
      if (err) console.error(err);
      rssiHandler.extractRssiData(JSON.parse(data), gateway);
      sseHandler.notifyClients(); // Notify clients of changes
    });

    fs.watch(fullPath, (eventType) => {
      if (eventType === 'change') {
        fs.readFile(fullPath, 'utf8', (err, data) => {
          if (err) console.error(err);
          rssiHandler.extractRssiData(JSON.parse(data), gateway);
          sseHandler.notifyClients(); // Notify clients of file changes
        });
      }
    });
  });
}

module.exports = { readAndWatchFiles };
