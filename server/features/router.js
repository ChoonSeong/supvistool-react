const express = require("express");
const router = express.Router();
const { getRssiData } = require('./rssiHandler');
const { performCalibration } = require('./calibration');

// Store RSSI values
let calibrationStore = {};

// Route to collect RSSI values for each position and distance
router.post('/collect-rssi', async (req, res) => {
  const { gatewayId, tagId, distance, position } = req.body;

  if (!gatewayId || !tagId || !distance || !position) {
    return res.status(400).json({ error: "Invalid input. Provide gatewayId, tagId, distance, and position." });
  }

  try {
    const rssiData = getRssiData();
    const rssiValue = rssiData[tagId]?.gateways[gatewayId]?.filteredRSSI;

    if (!rssiValue) {
      return res.status(500).json({ error: `No RSSI data found for gateway ${gatewayId} and tag ${tagId}` });
    }

    // Initialize calibrationStore
    if (!calibrationStore[tagId]) calibrationStore[tagId] = {};
    if (!calibrationStore[tagId][gatewayId]) calibrationStore[tagId][gatewayId] = {};
    if (!calibrationStore[tagId][gatewayId][distance]) calibrationStore[tagId][gatewayId][distance] = [];

    // Store the RSSI value for the given position and distance
    calibrationStore[tagId][gatewayId][distance][position] = rssiValue;

    res.json({ rssiValue });
  } catch (error) {
    console.error('Error collecting RSSI:', error.message);
    res.status(500).json({ error: 'Failed to collect RSSI value.' });
  }
});

// Route to process collected RSSI values and calculate path loss exponent
router.post('/start-calibration', async (req, res) => {
  const { gatewayId, tagId, distances, rssiValues } = req.body;

  if (!gatewayId || !tagId || !distances || !rssiValues) {
    return res.status(400).json({ error: "Invalid input. Provide gatewayId, tagId, distances, and rssiValues." });
  }

  if (rssiValues.length !== (distances.length )) {  // Ensuring we have 10 positions per distance
    return res.status(400).json({ error: "RSSI values and distances arrays must have the same length." });
  }
  console.log(rssiValues);
  console.log(distances);
  try {
    const { n, regressionLine } = performCalibration(rssiValues, distances);
    res.json({
      message: `Calibration complete for gateway ${gatewayId} and tag ${tagId}.`,
      pathLossExponent: n,
      regressionLine: regressionLine,
      rssiValues: rssiValues,
      distances: distances
    });
  } catch (error) {
    console.error('Error during calibration:', error.message);
    res.status(500).json({ error: `Failed to complete calibration: ${error.message}` });
  }
});

module.exports = router;
