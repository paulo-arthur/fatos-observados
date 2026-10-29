import jwt from 'jsonwebtoken';

export const validateJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ error: "Access denied. Token missing." });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        
    }
}