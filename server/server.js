const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('./features/router');
const mqttClient = require('./features/mqttClient');
const fileProcessor = require('./features/fileProcessor');
const sseHandler = require('./features/sseHandler');
const rssiHandler = require('./features/rssiHandler');



const app = express();
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());  // This is necessary to parse JSON bodies
app.use("/", router);


// Serve static files from the 'server/public' directory
app.use(express.static(path.join(__dirname,'public')));

// Initialize MQTT client and file processor
mqttClient.initializeMqttClient();
fileProcessor.readAndWatchFiles();

// SSE route to send updates to clients
app.get('/events', sseHandler.registerClient);

// RSSI Data API route
app.get('/data', (req, res) => {
  const data = rssiHandler.getRssiData();
  if (!data) {
    res.status(500).send('No data available');
  } else {
    res.json(data); // Serve JSON data for the client to fetch
  }
});

// Serves a basic HTML page to view data
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
      pre {
        background: #fff;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
    </style>
    <pre id="data-container">Loading data...</pre>
    <script>
      function fetchData() {
        fetch('/data')
          .then(response => response.json())
          .then(data => {
            document.getElementById('data-container').innerText = JSON.stringify(data, null, 2);
          })
          .catch(error => {
            document.getElementById('data-container').innerText = 'Error fetching data';
          });
      }

      fetchData(); // Fetch data on page load

      const eventSource = new EventSource('/events');
      eventSource.onmessage = () => {
        fetchData(); // Fetch new data when notified
      };
    </script>
  `);
});

const PORT = process.env.PORT || 4000; // Use a different port if necessary
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});