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

const mqtt = require("mqtt");
const fs = require("fs");

// MQTT connection options (credentials)
const options = {
  username: "supvistool",
  password: "1234Gateway",
};

// connect to hivemq cluster
const client = mqtt.connect(
  "tls://194f6ad3ec394491959182c6d30a59ef.s1.eu.hivemq.cloud:8883",
  options
);

// Store buffers for each gateway
const gatewayBuffers = {
  ac233fc17756: [], // Gateway 1
  ac233ffb3adb: [], // Gateway 2
  ac233ffb3adc: [], // Gateway 3
};

// Map gateways to topics (assuming your topics follow this pattern)
const topics = [
  "/gw/ac233fc17756/status", // Gateway 1
  "/gw/ac233ffb3adb/status", // Gateway 2
  "/gw/ac233ffb3adc/status", // Gateway 3
];

// Function to save the messages to a file
function saveToFile(gatewayId, buffer) {
  const filename = `${gatewayId}_data.json`;

  fs.writeFile(filename, JSON.stringify(buffer, null, 2), (err) => {
    if (err) throw err;
    console.log(`100 messages saved to ${filename}`);
    gatewayBuffers[gatewayId] = []; // Clear buffer after writing to the file
  });
}

// Handle received messages
client.on("message", function (topic, message) {
  const jsonMessage = JSON.parse(message.toString());

  // Extract gateway ID from the topic
  const gatewayId = topic.split("/")[2]; // assuming the topic is '/gw/{gatewayId}/status'

  if (gatewayBuffers[gatewayId]) {
    gatewayBuffers[gatewayId].push(jsonMessage);

    // If buffer reaches 100 messages, save to file
    if (gatewayBuffers[gatewayId].length === 100) {
      saveToFile(gatewayId, gatewayBuffers[gatewayId]);
    }
  }
});

// reassurance that the connection worked
client.on("connect", () => {
  console.log("Connected!");

  // Subscribe to all gateway topics
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

// prints an error message
client.on("error", (error) => {
  console.log("Error:", error);
});
