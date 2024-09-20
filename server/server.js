// server.js
const express = require('express');
const cors = require('cors');
const router = require('./features/router');
const mqttClient = require('./features/mqttClient');
const fileProcessor = require('./features/fileProcessor');
const sseHandler = require('./features/sseHandler');
const rssiHandler = require('./features/rssiHandler');

const app = express();
app.use(cors());
app.use("/", router);

// Initialize MQTT client and file processor
mqttClient.initializeMqttClient();
fileProcessor.readAndWatchFiles();

// SSE route
app.get('/events', sseHandler.registerClient);

// RSSI Data API route
app.get('/data', (req, res) => {
  const data = rssiHandler.getRssiData();

  if (!data) {
    console.error('No data available');
    res.status(500).send('No data available');
  } else {
    // Only log important data requests
    console.log('Sending updated data');
    res.send(`
      <h1>Data Storage</h1>
      <pre>${JSON.stringify(data, null, 2)}</pre>
      <script>
        // Auto-refresh using SSE
        const eventSource = new EventSource('/events');
        eventSource.onmessage = (event) => {
          if (event.data === 'updated') {
            console.log('Data updated, reloading...');
            window.location.reload(); // Auto-refresh page on update
          }
        };
      </script>
    `);
  }
});



app.listen(4000, () => console.log('Server running on port 4000'));
