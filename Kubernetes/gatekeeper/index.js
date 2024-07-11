const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 6000;
const FILE_PATH = "/rushi_PV_dir";

app.use(bodyParser.json());

app.post("/store-file", async (req, res) => {
  try {
    const { file, data } = req.body;

    if (!file || !data) {
      return res.status(400).json({ file: null, error: "Invalid JSON input." });
    }
    const filePath = path.join(FILE_PATH, file);
    fs.writeFile(filePath, data, async (err) => {
      if (err) {
        console.error("Error while storing the file:", err);
        return res.status(500).json({
          file,
          error: "Error while storing the file to the storage.",
        });
      }

      console.log("File saved successfully!!!ok:", filePath);
      return res.status(200).json({ file, message: "Success." });
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ file: null, error: "Internal server error." });
  }
});

app.post("/calculate", async (req, res) => {
  try {
    const { file, product } = req.body;

    if (!file || !product) {
      return res.status(400).json({ file: null, error: "Invalid JSON input." });
    }

    const response = await axios.post("http://calculator-service/sum", {
      file,
      product,
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error while forwarding request to Calculator:", error);
    return res.status(error.response.status).json(error.response.data);
  }
});

app.listen(port, () => {
  console.log(`Gatekeeper listening at http://localhost:${port}`);
});
