const express = require("express");
const router = express.Router();
const leastSquaresTrilateration = require("./leastSquareTrilateration");

// API endpoint to estimate position
router.post("/estimate-position", (req, res) => {
  const { gateways } = req.body;

  if (!gateways || gateways.length === 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const positions = gateways.map((gateway) => gateway.position);
  const distances = gateways.map((gateway) => gateway.distance);

  try {
    const estimatedPosition = leastSquaresTrilateration(positions, distances);
    res.json({ position: estimatedPosition });
  } catch (error) {
    res.status(500).json({ error: "Error estimating position" });
  }
});

module.exports = router;
