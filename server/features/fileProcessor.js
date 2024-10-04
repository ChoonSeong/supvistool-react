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

    // Initial read of the file
    fs.readFile(fullPath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file: ${fullPath}`, err);
        return;
      }

      try {
        const jsonData = JSON.parse(data);
        rssiHandler.extractRssiData(jsonData, gateway);
        sseHandler.notifyClients(); // Notify clients of changes
      } catch (parseError) {
        console.error(`Error parsing JSON in file: ${fullPath}`);
        console.error(`File content: ${data}`);
        console.error(`Parse error message: ${parseError.message}`);
        console.error(`Stack trace: ${parseError.stack}`);
      }
    });

    // Watch the file for changes
    fs.watch(fullPath, (eventType) => {
      if (eventType === 'change') {
        fs.readFile(fullPath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading file: ${fullPath}`, err);
            return;
          }

          try {
            const jsonData = JSON.parse(data);
            rssiHandler.extractRssiData(jsonData, gateway);
            sseHandler.notifyClients(); // Notify clients of file changes
          } catch (parseError) {
            console.error(`Error parsing JSON in file: ${fullPath}`);
            console.error(`File content: ${data}`);
            console.error(`Parse error message: ${parseError.message}`);
            console.error(`Stack trace: ${parseError.stack}`);
          }
        });
      }
    });
  });
}

module.exports = { readAndWatchFiles };
