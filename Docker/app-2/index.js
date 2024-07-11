const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const app = express();
const port = 9000;

app.use(bodyParser.json());

app.post("/sum", (req, res) => {
  const { file, product } = req.body;

  const filePath = path.join("./files", file);
  if (!file) {
    return res.status(400).json({ file: null, error: "Invalid JSON input." });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(200).json({ file: file, error: "File not found." });
  }

  const rows = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("error", (error) => {
      return res
        .status(400)
        .json({ file, error: "Input file not in CSV format." });
    })
    .on("data", (row) => {
      if (!("product" in row) || !("amount" in row)) {
        return res
          .status(400)
          .json({ file, error: "Input file not in CSV format." });
      }

      rows.push(row);
    })
    .on("end", () => {
      if (!rows.length) {
        return res
          .status(400)
          .json({ file, error: "Input file not in CSV format." });
      }

      const totalSum = rows
        .filter((row) => row.product === product && !isNaN(row.amount))
        .reduce((sum, row) => sum + parseInt(row.amount), 0);

      return res.json({ file, sum: totalSum });
    });
});

app.listen(port, () => {
  console.log(`Container 2 listening at http://localhost:${port}`);
});
