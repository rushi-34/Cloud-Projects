//changed file name to index.mjs on execution

import bcrypt from "bcryptjs";
import http from "http";

export async function handler(event) {
  console.log("event:::::", event);
  const data = event;
  const action = data.action;
  const value = data.value;

  const saltRounds = 10;
  const hashedValue = await bcrypt.hash(value, saltRounds);

  const response = {
    banner: "B00948619",
    result: hashedValue,
    arn: process.env.AWS_LAMBDA_FUNCTION_NAME,
    action: action,
    value: value,
  };

  console.log("respomse::::::", response);

  await sendResultToServer(response);

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
}

function sendResultToServer(data) {
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
