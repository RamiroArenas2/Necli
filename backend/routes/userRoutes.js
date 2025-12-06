const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
    try {
        const { fullname, idtype, phone, email, age: birthDateString, pin } = req.body;

        if (!fullname || !idtype || !phone || !email || !birthDateString || !pin) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Verificar si el usuario ya existe
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: "User already exists" });

        // Convertir fecha de nacimiento a edad
        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Crear nuevo usuario
        const newUser = new User({
            fullname,
            idtype,
            phone,
            email,
            age,          // edad calculada
            password: pin
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        console.log("Login attempt:", phone, password);

        if (!phone || !password) {
            return res.status(400).json({ error: "Phone and password are required" });
        }

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.password !== password) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
