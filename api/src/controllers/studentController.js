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

export const getStudentById = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM alunos WHERE id = ${req.params.id};`);
        
        if ( result.rows.length != 0 ) {
            return res.status(200).json(result.rows);
        } else {
            return res.status(500).json({ error: "This student was not found." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error has ocurred." });
    }
}