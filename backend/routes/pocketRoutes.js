const express = require("express");
const router = express.Router();
const Pocket = require("../models/Pocket");
const Account = require("../models/account"); // Verifica que el nombre del archivo coincida

// 1. OBTENER BOLSILLOS
router.get("/:userId", async (req, res) => {
  try {
    const pockets = await Pocket.find({ user: req.params.userId });
    res.json(pockets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREAR BOLSILLO
router.post("/create", async (req, res) => {
  const { userId, name, targetAmount } = req.body;
  try {
    const newPocket = new Pocket({
      user: userId,
      name,
      targetAmount,
    });
    const savedPocket = await newPocket.save();
    res.json(savedPocket);
  } catch (err) {
    res.status(500).json({ error: "Error al crear bolsillo" });
  }
});

// 3. TRANSACCIÓN (LA CORRECCIÓN ESTÁ AQUÍ)
router.post("/transaction", async (req, res) => {
  const { userId, pocketId, amount, type } = req.body;

  try {
    // Buscar cuenta por ID de usuario
    const account = await Account.findOne({ user: userId });
    const pocket = await Pocket.findById(pocketId);

    if (!account || !pocket) {
      return res.status(404).json({ error: "Cuenta o bolsillo no encontrado" });
    }

    const monto = Number(amount);

    if (type === "deposit") {
      // --- METER PLATA AL BOLSILLO ---

      // VALIDACIÓN: Usamos Balance_Account (Tal cual tu modelo)
      if (account.Balance_Account < monto) {
        return res
          .status(400)
          .json({ error: "Fondos insuficientes en tu Disponible" });
      }

      // RESTAR DEL DISPONIBLE (Usando el nombre correcto)
      account.Balance_Account -= monto;
      // SUMAR AL BOLSILLO
      pocket.currentAmount += monto;
    } else if (type === "withdraw") {
      // --- SACAR PLATA DEL BOLSILLO ---

      if (pocket.currentAmount < monto) {
        return res
          .status(400)
          .json({ error: "No tienes tanta plata en este bolsillo" });
      }

      // RESTAR DEL BOLSILLO
      pocket.currentAmount -= monto;
      // DEVOLVER AL DISPONIBLE (Usando el nombre correcto)
      account.Balance_Account += monto;
    }

    // Guardar cambios
    await account.save();
    await pocket.save();

    res.json({
      message: "Transacción exitosa",
      newPocketBalance: pocket.currentAmount,
      // Devolvemos el saldo de la cuenta también para actualizar
      newAccountBalance: account.Balance_Account,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la transacción" });
  }
});

// 4. ELIMINAR BOLSILLO Y DEVOLVER PLATA
router.delete("/:id", async (req, res) => {
  try {
    const pocket = await Pocket.findById(req.params.id);
    if (!pocket)
      return res.status(404).json({ error: "Bolsillo no encontrado" });

    const account = await Account.findOne({ user: pocket.user });

    // Si el bolsillo tiene plata, DEVOLVERLA A Balance_Account
    if (pocket.currentAmount > 0) {
      account.Balance_Account += pocket.currentAmount;
      await account.save();
    }

    await Pocket.findByIdAndDelete(req.params.id);

    res.json({ message: "Bolsillo eliminado y saldo devuelto a tu cuenta" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
