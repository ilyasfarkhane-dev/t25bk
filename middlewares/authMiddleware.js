const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    // Split Bearer from token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Malformed Token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied: Not Authorized' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT Error:', error.message); // Log the specific error
        res.status(400).json({ message: 'Invalid Token' });
    }
};

module.exports = authMiddleware;
