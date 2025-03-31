const express = require('express');
const router = express.Router();
const WaitingList = require('../models/WaitingList');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/join', async (req, res) => {
    try {
        const { name, email, tele } = req.body;
        const newEntry = new WaitingList({ name, email, tele });
        await newEntry.save();
        res.status(201).json({ message: '✅ Successfully added to the waiting list' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const list = await WaitingList.find();
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
