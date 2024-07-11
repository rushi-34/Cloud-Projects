const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const app = express();
const port = 9000;

const FILE_PATH = "/rushi_PV_dir";

app.use(bodyParser.json());

app.post("/sum", async (req, res) => {
  try {
    const { file, product } = req.body;

    if (!file || !product) {
      return res.status(400).json({ file: null, error: "Invalid JSON input." });
    }

    const filePath = path.join(FILE_PATH, file);

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ file, error: "File not found." });
    }

    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ", " }))
      .on("error", (error) => {
        console.error("Error parsing CSV:", error);
        return res
          .status(400)
          .json({ file, error: "Input file not in CSV format." });
      })
      .on("data", (row) => {
        const parsedRow = {
          product: row.product.trim(),
          amount: Number(row[" amount "].trim()),
        };
        console.log("Parsed row:", parsedRow);
        rows.push(parsedRow);
      })
      .on("end", () => {
        if (!rows.length) {
          console.error("No valid data in CSV...ok");
          return res
            .status(400)
            .json({ file, error: "Input file not in CSV format." });
        }

        const totalSum = rows
          .filter((row) => row.product === product && !isNaN(row.amount))
          .reduce((sum, row) => sum + parseInt(row.amount), 0);

        return res.json({ file, sum: totalSum });
      });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ file: null, error: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`Calculator listening at http://localhost:${port}`);
});
