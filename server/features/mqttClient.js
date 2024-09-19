/*
 * Copyright 2021 HiveMQ GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// features/mqttClient.js
const mqtt = require("mqtt");
const fs = require("fs");
const path = require("path");

// MQTT connection options
const options = {
  username: "supvistool",
  password: "1234Gateway",
};

// Store buffers for each gateway
const gatewayBuffers = {
  ac233fc17756: [],
  ac233ffb3adb: [],
  ac233ffb3adc: [],
};

// Map gateways to topics
const topics = [
  "/gw/ac233fc17756/status",
  "/gw/ac233ffb3adb/status",
  "/gw/ac233ffb3adc/status",
];

// Function to save messages to a file
function saveToFile(gatewayId, buffer) {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  const filename = path.join(dataDir, `${gatewayId}_data.json`);

  fs.writeFile(filename, JSON.stringify(buffer, null, 2), (err) => {
    if (err) throw err;
    console.log(`100 messages saved to ${filename}`);
    gatewayBuffers[gatewayId] = [];
  });
}

// Initialize MQTT client and handle subscriptions
function initializeMqttClient() {
  const client = mqtt.connect("tls://194f6ad3ec394491959182c6d30a59ef.s1.eu.hivemq.cloud:8883", options);

  client.on("message", (topic, message) => {
    const jsonMessage = JSON.parse(message.toString());
    const gatewayId = topic.split("/")[2];

    if (gatewayBuffers[gatewayId]) {
      gatewayBuffers[gatewayId].push(jsonMessage);

      if (gatewayBuffers[gatewayId].length === 100) {
        saveToFile(gatewayId, gatewayBuffers[gatewayId]);
      }
    }
  });

  client.on("connect", () => {
    console.log("Connected to HiveMQ!");

    topics.forEach((topic) => {
      client.subscribe(topic, (err) => {
        if (err) {
          console.log(`Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`Subscribed to ${topic}`);
        }
      });
    });
  });

  client.on("error", (error) => {
    console.log("MQTT Error:", error);
  });
}

module.exports = { initializeMqttClient };
