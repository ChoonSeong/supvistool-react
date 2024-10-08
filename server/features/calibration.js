const { SimpleLinearRegression } = require('ml-regression');

// Performs linear regression and calculates path loss exponent 'n'
function performCalibration(rssiValues, distances) {
  if (!rssiValues || !distances || rssiValues.length !== (distances.length)) {
    throw new Error("RSSI values and distances arrays must have the same length.");
  }

  // Convert distances to log10 scale
  const logDistances = distances.map(distance => Math.log10(distance));

  // Perform linear regression (log10 distances vs. RSSI values)
  const regression = new SimpleLinearRegression(logDistances, rssiValues);

  // The slope of the regression line is -10n
  const slope = regression.coefficients[1];
  const intercept = regression.coefficients[0];

  // Calculate path loss exponent n
  const n = -slope / 10;

  // Generate the regression line (for plotting)
  const regressionLine = logDistances.map(logDistance => slope * logDistance + intercept);

  return { n, regressionLine };
}

module.exports = { performCalibration };
