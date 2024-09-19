// server.js (renamed from index.js)
const express = require("express");
const cors = require("cors");
const path = require("path");
const router = require("./features/router");
const rssiHandler = require("./features/rssiHandler");
const { initializeMqttClient } = require("./features/mqttClient");

const app = express();
app.use(cors());
app.use("/", router);

// Initialize MQTT client
initializeMqttClient();

// Initialize reading and watching JSON files
rssiHandler.initializeFileReading();

// SSE route for clients to register for updates
app.get('/events', (req, res) => {
  rssiHandler.registerSSEClient(req, res);
});

// API to retrieve stored data
app.get('/data', (req, res) => {
  const data = rssiHandler.getRssiData();
  res.send(`
      <h1>RSSI Data</h1>
      <pre>${JSON.stringify(data, null, 2)}</pre>
      <script>
          // Create an EventSource to listen for updates from the server
          const eventSource = new EventSource('/events');

          eventSource.onmessage = (event) => {
              if (event.data === 'updated') {
                  console.log('Data updated on the server, reloading...');
                  window.location.reload(); // Reload the page when the server sends an update
              }
          };
      </script>
  `);
});

// Start the server
const port = 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

