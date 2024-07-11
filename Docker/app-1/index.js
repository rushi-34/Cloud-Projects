const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = 6000;

app.use(bodyParser.json());

app.post("/calculate", async (req, res) => {
  try {
    const { file, product } = req.body;

    if (!file) {
      return res.status(400).json({ file: null, error: "Invalid JSON input." });
    }


    const response = await axios.post(`${process.env.SERVER_HOST}/sum`, {
      file,
      product,
    });

    return res.json(response.data);
  } catch (error) {
    if (error.response && error.response.statusc !== 200) {
      return res.status(error.response.status).json(error.response.data);
    }
  }
});

app.listen(port, () => {
  console.log(`Container 1 listening at http://localhost:${port}`);
});
