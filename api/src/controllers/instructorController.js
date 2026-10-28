import { pool } from  "../db.js";

export const listInstructors = async (req, res) => {
    try {
        //TODO: select only the necessary field of the JOIN due to security reasons.
        const result = await pool.query(`SELECT * FROM instrutores ORDER BY posto, nome`);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error getting the FOs list."});
    }
}

export const getInstructorById = async (req, res) => {
    try {
        //TODO: select only the necessary field of the JOIN due to security reasons.
        const result = await pool.query(`SELECT * FROM instrutores WHERE id = ${req.params.id}`);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error getting the FOs list."});
    }
}