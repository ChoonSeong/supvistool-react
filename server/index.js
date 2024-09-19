const express = require("express");
const cors = require("cors");
const router = require("./features/router");
require("./features/mqttClient");

const app = express();

app.use(cors());
app.use("/", router);

const port = 4000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
