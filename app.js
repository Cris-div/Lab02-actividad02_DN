const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET
app.get("/usuarios", async (req, res) => {
  const result = await pool.query("SELECT * FROM usuarios");
  res.json(result.rows);
});

// POST
app.post("/usuarios", async (req, res) => {
  const { nombre, correo, edad, ciudad } = req.body;
  const result = await pool.query(
    "INSERT INTO usuarios (nombre, correo, edad, ciudad) VALUES ($1,$2,$3,$4) RETURNING *",
    [nombre, correo, edad, ciudad]
  );
  res.json(result.rows[0]);
});

// PUT
app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, edad, ciudad } = req.body;

  await pool.query(
    "UPDATE usuarios SET nombre=$1, correo=$2, edad=$3, ciudad=$4 WHERE id=$5",
    [nombre, correo, edad, ciudad, id]
  );

  res.send("Actualizado");
});

// DELETE
app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM usuarios WHERE id=$1", [id]);
  res.send("Eliminado");
});

app.listen(process.env.PORT || 3000, () => 
  console.log("Servidor corriendo")
);