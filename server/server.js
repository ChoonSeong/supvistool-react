const express = require("express");
const cors = require("cors");
const path = require("path");
const router = require("./features/router");
const mqttClient = require("./features/mqttClient");
const fileProcessor = require("./features/fileProcessor");
const sseHandler = require("./features/sseHandler");
const rssiHandler = require("./features/rssiHandler");

const app = express();
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json()); // This is necessary to parse JSON bodies
app.use("/", router);

// Serve static files from the 'server/public' directory
app.use(express.static(path.join(__dirname, "public")));

// Initialize MQTT client and file processor
mqttClient.initializeMqttClient();
fileProcessor.readAndWatchFiles();

// SSE route to send updates to clients
app.get("/events", sseHandler.registerClient);

// RSSI Data API route
app.get("/data", (req, res) => {
  const data = rssiHandler.getRssiData();
  if (!data) {
    res.status(500).send("No data available");
  } else {
    res.json(data); // Serve JSON data for the client to fetch
  }
});

// RSSI Data API route
app.get("/graphdata", (req, res) => {
  const data = rssiHandler.getRssiData();

  // Assuming you're interested in one specific tag and gateway
  const tagId = "c3000021bdac"; // Replace with the actual tag ID you're interested in
  const gatewayId = "ac233ffb3adb"; // Replace with the actual gateway ID you're interested in

  if (!data[tagId] || !data[tagId].gateways[gatewayId]) {
    res.status(404).send("No data available for the specified tag and gateway");
    return;
  }

  const gatewayInfo = data[tagId].gateways[gatewayId];

  // Average the latest 10 raw RSSI values
  const rawRssi = gatewayInfo.rssiValues || [];
  const latestRawRssi = rawRssi.slice(-10);
  const averageRawRssi = calculateAverageRssi(latestRawRssi);

  // Return the averaged raw RSSI and the filtered RSSI
  res.json({
    averageRawRssi,
    filteredRSSI: gatewayInfo.filteredRSSI,
    lastUpdated: gatewayInfo.lastUpdated,
  });
});

// Helper function to calculate average RSSI
function calculateAverageRssi(rssiValues) {
  if (rssiValues.length === 0) return null;
  const sum = rssiValues.reduce((acc, value) => acc + value, 0);
  return sum / rssiValues.length;
}

// Serves a basic HTML page to view data
app.get("/view-data", (req, res) => {
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

// Serves a basic HTML page to view data
app.get("/view-graph", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RSSI Data</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
        <h1>RSSI Data Visualization</h1>
        <canvas id="rssiChart" width="800" height="400"></canvas>

        <script>
            const rawRssiData = [];
            const smoothedRssiData = [];

            const ctx = document.getElementById('rssiChart').getContext('2d');
            const rssiChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],  // Time labels will go here
                    datasets: [
                        {
                            label: 'Average Raw RSSI',
                            data: rawRssiData,
                            borderColor: 'rgb(255, 99, 132)',
                            fill: false,
                        },
                        {
                            label: 'Filtered RSSI',
                            data: smoothedRssiData,
                            borderColor: 'rgb(54, 162, 235)',
                            fill: false,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'RSSI Values Over Time'
                        }
                    }
                },
            });

            function fetchData() {
                fetch('/graphdata')
                    .then(response => response.json())
                    .then(data => {
                        const currentTime = new Date().toLocaleTimeString();
                        
                        // Add new data to the graph
                        rawRssiData.push(data.averageRawRssi);
                        smoothedRssiData.push(data.filteredRSSI);

                        // Update labels with time
                        rssiChart.data.labels.push(currentTime);
                        
                        // Limit the dataset to the last 20 points
                        if (rawRssiData.length > 20) {
                            rawRssiData.shift();
                            smoothedRssiData.shift();
                            rssiChart.data.labels.shift();
                        }

                        rssiChart.update();
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            }

            // Fetch data every 2 seconds
            setInterval(fetchData, 2000);

            // Initial data fetch
            fetchData();
        </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 4000; // Use a different port if necessary
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
