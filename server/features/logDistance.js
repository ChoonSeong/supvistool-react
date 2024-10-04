// Define RSSI values for each gateway
const gatewaysRSSI = {
  ac233fc17756: [
    [-52.527715, -43.280146, -33.4723, -32.225318, -50.723617], // RSSI values at 1 meter
    [-50.226295, -45.123249, -43.515734, -42.045271, -57.738285], // RSSI values at 2 meters
    [-47.372524, -47.273578, -49.4994, -52.283486, -51.577485], // RSSI values at 3 meters
  ],
  ac233ffb3adb: [
    [-52.492844, -43.108205, -36.999759, -37.37854, -47.925442], // RSSI values at 1 meter
    [-55.004708, -52.015515, -47.848812, -53.829135, -53.092408], // RSSI values at 2 meters
    [-57.097343, -57.772869, -46.494994, -50.124596, -51.705364], // RSSI values at 3 meters
  ],
  ac233ffb3adc: [
    [-53.987654, -41.987654, -38.123456, -36.54321, -46.654321], // RSSI values at 1 meter
    [-57.765432, -55.123456, -45.234567, -50.987654, -51.876543], // RSSI values at 2 meters
    [-59.432123, -57.321654, -48.987654, -51.432109, -54.654321], // RSSI values at 3 meters
  ],
};

// Define distances for the RSSI values
const distances = [1, 2, 3];

// Function to calculate the average RSSI and estimate the path loss exponent
function calculatePathLoss(gatewayId) {
  const rssi_values_angles = gatewaysRSSI[gatewayId];

  // Flatten the rssi_values_angles array and create a corresponding distances array
  const flattenedRSSI = [];
  const flattenedDistances = [];

  rssi_values_angles.forEach((rssiValues, index) => {
    const distance = distances[index]; // Corresponding distance for the set of RSSI values
    rssiValues.forEach((rssi) => {
      flattenedRSSI.push(rssi);
      flattenedDistances.push(distance);
    });
  });

  // Calculate log10 of distances
  const log_distances = flattenedDistances.map((distance) => Math.log10(distance));

  // Perform linear regression using least squares
  function linearRegression(x, y) {
    let n = x.length;
    let sumX = x.reduce((a, b) => a + b, 0);
    let sumY = y.reduce((a, b) => a + b, 0);
    let sumXY = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b, 0);
    let sumX2 = x.map((xi) => xi * xi).reduce((a, b) => a + b, 0);

    let slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    let intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  const { slope, intercept } = linearRegression(
    log_distances,
    flattenedRSSI
  );

  // Calculate the path loss exponent n
  const n = -slope / 10;

  console.log(
    `Gateway ${gatewayId} - RSSI0 (Intercept): ${intercept.toFixed(2)} dBm`
  );
  console.log(`Gateway ${gatewayId} - Path Loss Exponent (n): ${n.toFixed(2)}`);

  return { rssi0: intercept, pathLossExponent: n };
}

// Function to estimate the distance based on measured RSSI for a specific gateway
function estimateDistanceForGateway(gatewayId, rssiMeasured) {
  const { rssi0, pathLossExponent } = calculatePathLoss(gatewayId);

  // Using the rearranged path loss model formula
  return Math.pow(10, (rssi0 - rssiMeasured) / (10 * pathLossExponent));
}

module.exports = { estimateDistanceForGateway };