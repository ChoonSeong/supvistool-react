const numeric = require("numeric");

function leastSquaresTrilateration(gateways, distances) {
  // Initial guess (centroid of the gateways)
  const initialGuess = [
    gateways.reduce((sum, g) => sum + g[0], 0) / gateways.length,
    gateways.reduce((sum, g) => sum + g[1], 0) / gateways.length,
  ];

  // Define the objective function
  const objectiveFunction = (p) => {
    let errorSum = 0;
    for (let i = 0; i < gateways.length; i++) {
      const distanceError =
        Math.sqrt((gateways[i][0] - p[0]) ** 2 + (gateways[i][1] - p[1]) ** 2) -
        distances[i];
      errorSum += distanceError ** 2;
    }
    return errorSum;
  };

  // Use numeric's minimization function to find the optimal position
  const solution = numeric.uncmin(objectiveFunction, initialGuess);
  return solution.solution; // This will give the estimated position [x, y]
}

module.exports = { leastSquaresTrilateration };
