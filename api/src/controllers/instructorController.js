import { pool } from  "../db.js";
import { sanitizeNewInstructor } from "../utils/sanitizers.js";

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

export const createNewInstructor = async (req, res) => {
    const { name, rank, email, password } = req.body;

    try {
        const testedFields = sanitizeNewInstructor(name, rank, email, password);

        if (testedFields.isValid) {
            // RETURNING excludes 'senha' to avoid exposing the hash/password in response
            const query = `
                INSERT INTO instrutores (nome, posto, email, senha_hash) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id, nome, posto, email;
            `;
            const values = [
                testedFields.name, 
                testedFields.rank, 
                testedFields.email, 
                testedFields.password
            ];

            const result = await pool.query(query, values);

            return res.status(201).json({
                message: "Instructor registered successfully.",
                instructor: result.rows[0]
            });
        } else {
            return res.status(400).json(testedFields);
        }

    } catch (error) {
        console.log(error);

        // PostgreSQL code '23505' = unique_violation (email conflict)
        if (error.code === "23505") {
            if (error.constraint?.includes("email")) {
                return res.status(409).json({ error: "This email is already registered." });
            }
        }

        return res.status(500).json({ error: "An error has occurred." });
    }
};