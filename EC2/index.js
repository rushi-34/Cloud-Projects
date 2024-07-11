const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 80;
const app = express();
app.use(express.json());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "a2db.cvm2y4y88w1v.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "root1234",
  database: "a2storage",
});

app.post("/store-products", (req, res) => {
  const products = req.body.products;

  if (!Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid input: products array is missing or empty" });
  }

  const isValidInput = products.every(
    (product) =>
      product.name &&
      typeof product.name === "string" &&
      product.price &&
      typeof product.price === "string" &&
      product.availability !== undefined &&
      typeof product.availability === "boolean"
  );

  if (!isValidInput) {
    return res.status(400).json({
      error: "Invalid input: products array contains invalid objects",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }

    const sql = "INSERT INTO products (name, price, availability) VALUES ?";
    const values = products.map((product) => [
      product.name,
      product.price,
      product.availability,
    ]);

    connection.query(sql, [values], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query: " + err.stack);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ message: "Success." });
    });
  });
});

app.get("/list-products", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }

    const sql = "SELECT name, price, availability FROM products";

    connection.query(sql, (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query: " + err.stack);
        return res.status(500).json({ error: "Database error" });
      }

      const products = results.map((product) => ({
        name: product.name,
        price: product.price,
        availability: product.availability === 1 ? true : false,
      }));
      res.status(200).json({ products });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
