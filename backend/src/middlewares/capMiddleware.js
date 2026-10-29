import jwt from 'jsonwebtoken';

export const requireCaptain = (req, res, next) => {
    if (!req.user || !req.user.rank) {
        return res.status(403).json({ error: "Access denied. Rank information missing." });
    }

    const rank = req.user.rank.toLowerCase();

    if (rank.includes("cap")) {
        return next();
    }

    return res.status(403).json({ 
        error: "Access denied. Only Captains can perform this action." 
    });
}