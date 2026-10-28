import { pool } from  "../db.js";
import { sanitizeNewInstructor } from "../utils/sanitizers.js";

export const listInstructors = async (req, res) => {
    try {
        const query = `
            SELECT id, nome, posto, email, ativo 
            FROM instrutores 
            ORDER BY posto, nome`;
        const result = await pool.query(query);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error getting the FOs list."});
    }
}

export const getInstructorById = async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id) || Number(id) <= 0) {
            return res.status(400).json({ error: "Invalid Instructor ID. Must be a positive number." });
        }

        const query = `
            SELECT nome, posto, email, ativo
            FROM instrutores 
            WHERE id = $1`;
        const result = await pool.query(query, [id]);
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

export const toggleInstructorState = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id) || Number(id) <= 0) {
        return res.status(400).json({ error: "Invalid Instructor ID. Must be a positive number." });
    }

    try {
        const query = `
            UPDATE instrutores
            SET ativo = NOT ativo
            WHERE id = $1
            RETURNING id, nome, posto, email, ativo;
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Instructor not found." });
        }

        const updatedInstructor = result.rows[0];
        const statusMessage = updatedInstructor.ativo 
            ? "Instructor activated successfully." 
            : "Instructor deactivated successfully.";

        return res.status(200).json({
            message: statusMessage,
            instructor: updatedInstructor
        });

    } catch (error) {
        console.error("Error toggling instructor status:", error);

        if (error.code === "22P02" || error.code === "22003") {
            return res.status(400).json({ error: "Invalid Instructor ID format." });
        }

        return res.status(500).json({ error: "An error has occurred." });
    }
};