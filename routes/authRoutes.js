const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

const ADMIN_USER = {
    username: 'admin',
    password: 'admin123', 
    role: 'admin'
};


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

   
    if (username !== ADMIN_USER.username) {
        return res.status(400).json({ message: 'Invalid Credentials' });
    }

    
    const isMatch = await bcrypt.compare(password, await bcrypt.hash(ADMIN_USER.password, 10));
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
    }

   
    const token = jwt.sign({ username, role: ADMIN_USER.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
});

module.exports = router;
