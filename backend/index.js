const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./config/database");

const userRoutes = require("./routes/userRoutes");
const accountRoutes = require("./routes/accountRoutes");
const cardRoutes = require("./routes/cardRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const pocketRoutes = require("./routes/pocketRoutes"); // <--- 1. IMPORTAR RUTAS DE BOLSILLOS

const app = express();
app.use(cors());
app.use(express.json());

connectToDatabase();

app.get("/", (req, res) => res.json({ ok: true, message: "API is working" }));

app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/pockets", pocketRoutes); // <--- 2. USAR LA RUTA

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res
    .status(500)
    .json({ error: "Internal server error", details: err.message });
});
