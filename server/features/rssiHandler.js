const KalmanFilter = require('kalmanjs');
const { estimateDistanceForGateway } = require("./logDistance");
const { leastSquaresTrilateration } = require("./leastSquareTrilateration");

const gatewayCoordinates = {
  "ac233ffb3adc": [5.264, 0],
  "ac233fc17756": [3.15, 6.83],
  "ac233ffb3adb": [13.6, 0],
};

let rssiData = {};
const WINDOW_SIZE = 30;

// Calculates the average RSSI value from a list
function calculateAverageRssi(rssiValues) {
  if (rssiValues.length === 0) return null;
  const sum = rssiValues.reduce((acc, value) => acc + value, 0);
  return sum / rssiValues.length;
}

// Function to detect and remove outliers using the modified Z-score
function detectOutliers(rssiValues) {
  const median = rssiValues.sort((a, b) => a - b)[Math.floor(rssiValues.length / 2)];
  const MAD = rssiValues.reduce((acc, val) => acc + Math.abs(val - median), 0) / rssiValues.length;

  // If MAD is zero, return the original array because there are no outliers
  if (MAD === 0) {
    return rssiValues;
  }

  const filteredValues = rssiValues.filter(rssi => {
    const modifiedZ = 0.6745 * (rssi - median) / MAD;
    return Math.abs(modifiedZ) <= 2;
  });

  // Calculate the number of removed outliers
  const removedCount = rssiValues.length - filteredValues.length;

  // Log or return the number of removed values
  //console.log(`Outliers removed: ${removedCount}`);


  return filteredValues;
}

// Adaptive Kalman filter with dynamic R and Q adjustments based on fluctuation and trend detection
function applyKalmanFilter(gatewayInfo, rssiValues) {
  let baseR = 1000;  // Base value for R
  let baseQ = 0.01; // Base value for Q
  const acceptableFluctuation = 1; // Acceptable fluctuation in dB
  const trendFactor = 0.01; // Adjustment factor for trends
  
  // Calculate the mean and variance of the RSSI values in the sliding window
  const meanRssi = calculateAverageRssi(rssiValues);
  const variance = rssiValues.reduce((acc, rssi) => acc + Math.pow(rssi - meanRssi, 2), 0) / rssiValues.length;
  const fluctuation = Math.sqrt(variance);

  // Calculate trend: difference between first and last RSSI in the window
  const trend = rssiValues[rssiValues.length - 1] - rssiValues[0];

  // Adjust R and Q dynamically based on fluctuation and trend
  let R = baseR;
  let Q = baseQ;

  // More stability when fluctuation is low (less than acceptable fluctuation)
  if (fluctuation < acceptableFluctuation) {
    R = baseR + (500 * (1 - fluctuation / acceptableFluctuation));
  }

  // Allow fast response for larger fluctuations
  if (fluctuation > acceptableFluctuation) {
    Q = baseQ + (0.01 * (fluctuation - acceptableFluctuation));
  }

  // Adjust R or Q based on RSSI trend (rising or falling)
  if (trend > 0) {
    // RSSI increasing: object moving closer, increase Q for faster adaptation
    Q += trendFactor * trend;
  } else if (trend < 0) {
    // RSSI decreasing: object moving away, increase R for more stability
    R += trendFactor * Math.abs(trend);
  }

  // Apply smoothing to prevent large jumps in R and Q
  R = gatewayInfo.prevR ? 0.9 * gatewayInfo.prevR + 0.1 * R : R;
  Q = gatewayInfo.prevQ ? 0.9 * gatewayInfo.prevQ + 0.1 * Q : Q;

  // Store R and Q for future use
  gatewayInfo.prevR = R;
  gatewayInfo.prevQ = Q;

  const kalman = new KalmanFilter({ R, Q });

  // Start filtering from the previous filtered RSSI if it exists
  if (gatewayInfo.prevFilteredRSSI !== null) {
    kalman.filter(gatewayInfo.prevFilteredRSSI);
  }

  // Apply the Kalman filter to each RSSI value in the sliding window
  return rssiValues.map(rssi => kalman.filter(rssi));
}

// Function to calculate Exponential Moving Average (EMA)
function calculateEMA(rssiValues, prevEma, alpha = 0.1) {
  // If no previous EMA exists, use the first RSSI value as the initial EMA
  let ema = prevEma !== null ? prevEma : rssiValues[0];

  // Apply the EMA formula iteratively
  rssiValues.forEach(rssi => {
    ema = alpha * rssi + (1 - alpha) * ema;
  });

  return ema;
}


// Process RSSI data for each tag in a batch
async function processRssiDataBatch(tagData) {
  for (let gateway in tagData.gateways) {
     let gatewayInfo = tagData.gateways[gateway];

    // Check if RSSI values exist
    if (!gatewayInfo.rssiValues || gatewayInfo.rssiValues.length === 0) {
      continue; // Skip processing if there are no RSSI values
    }

    // Only take the 10 most recent RSSI values for outlier detection
    const recentRssiValues = gatewayInfo.rssiValues.slice(-10);

    // Perform outlier detection on these 10 values
    const cleanedRssi = detectOutliers(recentRssiValues);
    if (!cleanedRssi || cleanedRssi.length === 0) {
      continue; // Skip if no valid RSSI data after outlier detection
    }

    // Replace the last 10 values in rssiValues with the cleaned RSSI values
    gatewayInfo.rssiValues.splice(-10, 10, ...cleanedRssi);


    // Apply Kalman filter to the entire updated RSSI window
    const smoothedRssi = applyKalmanFilter(gatewayInfo, gatewayInfo.rssiValues);
    if (!smoothedRssi || smoothedRssi.length === 0) {
      continue; // Skip if Kalman filter failed to process data
    }

    // Apply EMA after Kalman filtering
    const emaRssi = calculateEMA(smoothedRssi, gatewayInfo.filteredRSSI);


    // Update the filtered RSSI and distance
    gatewayInfo.prevFilteredRSSI = gatewayInfo.filteredRSSI;
    gatewayInfo.filteredRSSI = emaRssi;
    gatewayInfo.distance = estimateDistanceForGateway(gateway, emaRssi);
    gatewayInfo.lastUpdated = new Date().toLocaleString();
  }

  // Perform trilateration after processing all gateways
  await performTrilateration();
}




// Extract RSSI data from incoming JSON and process it
function extractRssiData(jsonData) {
  jsonData.forEach((entry) => {
    const gatewayInfo = entry[0];
    const gatewayId = gatewayInfo.gateway;

    for (let i = 1; i < entry.length; i++) {
      const tagInfo = entry[i];
      const macAddress = tagInfo.mac;
      const rssi = tagInfo.rssi;

      if (!rssiData[macAddress]) {
        rssiData[macAddress] = { gateways: {}, position: { x: null, y: null } };
      }

      if (!rssiData[macAddress].gateways[gatewayId]) {
        rssiData[macAddress].gateways[gatewayId] = {
          rssiValues: [],
          filteredRSSI: null,
          prevFilteredRSSI: null,
          prevR: null,
          prevQ: null,
          distance: null,
          lastUpdated: null,
        };
      }

      
      const gatewayInfoForTag = rssiData[macAddress].gateways[gatewayId];
      if (gatewayInfoForTag.rssiValues.length >= WINDOW_SIZE) {
        gatewayInfoForTag.rssiValues.shift();
      }

      gatewayInfoForTag.rssiValues.push(rssi);


      gatewayInfoForTag.lastUpdated = new Date(tagInfo.timestamp).toISOString();
    }
  });

  // Process only the most recent 10 data points in processRssiDataBatch
  jsonData.forEach(async (entry) => {
    for (let i = 1; i < entry.length; i++) {
      const macAddress = entry[i].mac;
      await processRssiDataBatch(rssiData[macAddress]);
    }
  });
}

// Performs trilateration to estimate position
async function performTrilateration() {
  for (const mac in rssiData) {
    const gateways = rssiData[mac].gateways;
    const gatewayCoords = [];
    const distances = [];

    for (const gatewayId in gateways) {
      if (gatewayCoordinates[gatewayId] && gateways[gatewayId].distance !== null) {
        gatewayCoords.push(gatewayCoordinates[gatewayId]);
        distances.push(gateways[gatewayId].distance);
      }
    }

    if (gatewayCoords.length >= 3 && distances.length >= 3) {
      const estimatedPosition = await leastSquaresTrilateration(gatewayCoords, distances);
      rssiData[mac].position = { x: estimatedPosition[0], y: estimatedPosition[1] };
    } else {
      rssiData[mac].position = { x: null, y: null };
    }
  }
}

// Returns the RSSI data with filteredRSSI, distance, previousDistance, and lastUpdated fields
function getRssiData() {
  const dataToReturn = JSON.parse(JSON.stringify(rssiData));

  for (const mac in dataToReturn) {
    const gateways = dataToReturn[mac].gateways;
    for (const gateway in gateways) {
      delete gateways[gateway].rssiValues; // Remove rssiValues but keep filteredRSSI, distance, etc.
    }
  }

  return dataToReturn;
}

module.exports = { extractRssiData, getRssiData };
