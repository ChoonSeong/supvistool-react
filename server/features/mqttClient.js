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

// your credentials
const options = {
  username: "supvistool",
  password: "1234Gateway",
};

// connect to your cluster, insert your host name and port
const client = mqtt.connect(
  "tls://194f6ad3ec394491959182c6d30a59ef.s1.eu.hivemq.cloud:8883",
  options
);

let messageBuffer = [];

// prints a received message
client.on("message", function (topic, message) {
  const jsonMessage = JSON.parse(message.toString()); // convert byte array to string and then to JSON
  messageBuffer.push(jsonMessage);

  // If we have 100 messages, write them to a file
  if (messageBuffer.length === 100) {
    fs.writeFile(
      "iot_data.json",
      JSON.stringify(messageBuffer, null, 2),
      (err) => {
        if (err) throw err;
        console.log("100 messages saved to iot_data.json");
        messageBuffer = []; // clear the buffer after writing to the file
      }
    );
  }
});

// reassurance that the connection worked
client.on("connect", () => {
  console.log("Connected!");
});

// prints an error message
client.on("error", (error) => {
  console.log("Error:", error);
});

// subscribe to the topic
client.subscribe("/gw/ac233ffb3adc/status");
