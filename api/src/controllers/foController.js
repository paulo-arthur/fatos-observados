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

export const getFOById = async (req, res) => {
    try {
        //TODO: select only the necessary field of the JOIN due to security reasons.
        const result = await pool.query(`SELECT * FROM fos FULL JOIN alunos ON fos.alvo_id = alunos.id FULL JOIN instrutores ON fos.autor_id = instrutores.id WHERE fos.id = ${req.params.id}`);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error getting the FOs list."});
    }
}

export const getFOsOfStudent = async (req, res) => {
    try {
        //TODO: select only the necessary field of the JOIN due to security reasons.
        const result = await pool.query(`SELECT * FROM fos WHERE alvo_id = ${req.params.studentId}`);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error getting the FOs list."});
    }
}