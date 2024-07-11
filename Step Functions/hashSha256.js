//changed file name to index.mjs on execution

import crypto from "crypto";
import http from "http";

export async function handler(event) {
  console.log("event:::::", event);
  const data = event;
  const action = data.action;
  const value = data.value;
  const courseUri = data.course_uri;

  const hashedValue = crypto
    .createHash("sha256")
    .update(value, "utf8")
    .digest("hex");

  const response = {
    banner: "B00948619",
    result: hashedValue,
    arn: process.env.AWS_LAMBDA_FUNCTION_NAME,
    action: action,
    value: value,
  };

  console.log("respomse::::::", response);

  await sendResultToServer("129.173.67.234:8080", response);

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
}

function sendResultToServer(url, data) {
  const payload = JSON.stringify(data);
  const options = {
    hostname: "129.173.67.234",
    port: 8080,
    path: "/serverless/end",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d);
      });
      resolve();
    });

    req.on("error", (error) => {
      console.error(error);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}
