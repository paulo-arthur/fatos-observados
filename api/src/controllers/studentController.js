import { pool } from  "../db.js";

export const listStudents = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM alunos ORDER BY numero;");
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error has ocurred." });
    }
}