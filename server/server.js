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
    res.status(500).send('No data available');
  } else {
    res.json(data);  // Serve JSON data for the client to fetch
  }
});

// Serving a basic HTML page with dynamic content update
app.get('/view-data', (req, res) => {
  res.send(`
    <h1>Data Storage</h1>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 20px;
      }
      h1 {
        color: #333;
      }
      pre {
        background: #fff;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
    </style>
    <pre id="data-container">Loading data...</pre>
    <script>
      // Function to fetch data from the server
      function fetchData() {
        fetch('/data')
          .then(response => response.json())
          .then(data => {
            document.getElementById('data-container').innerText = JSON.stringify(data, null, 2);
          })
          .catch(error => {
            document.getElementById('data-container').innerText = 'Error fetching data';
            console.error('Error:', error);
          });
      }

      // Fetch data immediately on page load
      fetchData();

      // Use Server-Sent Events (SSE) to listen for updates
      const eventSource = new EventSource('/events');
      eventSource.onmessage = (event) => {
        if (event.data === 'updated') {
          console.log('Data updated, fetching new data...');
          fetchData(); // Fetch new data when notified by SSE
        }
      };
    </script>
  `);
});

app.listen(4000, () => console.log('Server running on port 4000'));