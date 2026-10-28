import { pool } from  "../db.js";
import { sanitizeNewFO } from "../utils/sanitizers.js";

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
        //TODO: fix column "nome" supression.
        const result = await pool
        .query(`SELECT * 
                FROM fos 
                FULL JOIN alunos ON fos.alvo_id = alunos.id 
                FULL JOIN instrutores ON fos.autor_id = instrutores.id 
                WHERE fos.id = ${req.params.id}`);
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

export const createNewFO = async (req, res) => {
    const { authorId, targetId, description } = req.body;

    try {
        const testedFields = sanitizeNewFO(authorId, targetId, description);

        if (testedFields.isValid) {
            const query = `
                INSERT INTO fos (autor_id, alvo_id, descricao) 
                VALUES ($1, $2, $3) 
                RETURNING *;
            `;
            const values = [testedFields.authorId, testedFields.targetId, testedFields.description];
            
            const result = await pool.query(query, values);

            return res.status(201).json({
                message: "FO created successfully.",
                fo: result.rows[0]
            });
        } else {
            return res.status(400).json(testedFields);
        }

    } catch (error) {
        console.log(error);

        // PostgreSQL code '23503' = foreign_key_violation (autor_id or alvo_id not found)
        if (error.code === "23503") {
            if (error.constraint?.includes("autor")) {
                return res.status(404).json({ error: "The specified author (instructor) does not exist." });
            }
            if (error.constraint?.includes("militar")) {
                return res.status(404).json({ error: "The specified target (student) does not exist." });
            }
        }

        return res.status(500).json({ error: "An error has occurred." });
    }
};