import { pool } from  "../db.js";

export const listFOs = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM fos ORDER BY data");
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error getting the FOs list."});
    }
}