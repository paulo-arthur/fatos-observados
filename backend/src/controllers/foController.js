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
    const id = req.params.id;

    try {
        //TODO: fix column "nome" supression.
        if (isNaN(id) || Number(id) <= 0) {
            return res.status(400).json({ error: "Invalid FO ID. Must be a positive number." });
        }

        const query = `
                SELECT descricao, foi_julgado, data, instrutores.nome, instrutores.posto, alunos.nome, alunos.numero 
                FROM fos 
                FULL JOIN alunos ON fos.alvo_id = alunos.id 
                FULL JOIN instrutores ON fos.autor_id = instrutores.id 
                WHERE fos.id = $1`;
        const result = await pool.query(query, [id]);

        return res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error getting the FOs list."});
    }
}

export const getFOsOfStudent = async (req, res) => {
    const studentId = req.params.studentId;
    try {
        const query = `
                SELECT descricao, foi_julgado, data, instrutores.nome, instrutores.posto
                FROM fos
                FULL JOIN instrutores ON fos.autor_id = instrutores.id 
                WHERE alvo_id = $1`;

        const result = await pool.query(query, [studentId]);
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

export const judgeFO = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id) || Number(id) <= 0) {
        return res.status(400).json({ error: "Invalid FO ID. Must be a positive number." });
    }

    try {
        const checkQuery = `SELECT foi_julgado FROM fos WHERE id = $1;`;
        const checkResult = await pool.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: "FO not found." });
        }

        if (checkResult.rows[0].foi_julgado) {
            return res.status(409).json({ error: "This FO has already been judged." });
        }

        const updateQuery = `
            UPDATE fos
            SET foi_julgado = true
            WHERE id = $1
            RETURNING *;
        `;
        const result = await pool.query(updateQuery, [id]);

        return res.status(200).json({
            message: "FO marked as judged successfully.",
            fo: result.rows[0]
        });

    } catch (error) {
        console.error("Error judging FO:", error);

        // PostgreSQL error code '22P02' (invalid text representation for integer)
        if (error.code === "22P02" || error.code === "22003") {
            return res.status(400).json({ error: "Invalid FO ID format." });
        }

        return res.status(500).json({ error: "An error has occurred." });
    }
};