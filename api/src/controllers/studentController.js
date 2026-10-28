import { pool } from  "../db.js";
import { sanitizeNewStudent } from "../utils/sanitizers.js";

export const listStudents = async (req, res) => {

    const query = `
            SELECT *
            FROM alunos 
            ORDER BY numero;`;

    try {
        const result = await pool.query(query);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error has ocurred." });
    }
}

export const getStudentById = async (req, res) => {
    const id = req.params.id;
    const query = `
            SELECT *
            FROM alunos
            WHERE id = $1;`;
    try {
        const result = await pool.query(query, [id]);
        
        if ( result.rows.length != 0 ) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ error: "This student was not found." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error has ocurred." });
    }
}

export const createNewStudent = async (req, res) => {
    const {name, number, email} = req.body;
    try {
        const testedFields = sanitizeNewStudent(name, number, email);
        if (testedFields.isValid) {

            const query = `
                    INSERT INTO alunos 
                    (nome, numero, email) 
                    VALUES 
                    ($1, $2, $3)`;
            const result = await pool.query(query, [testedFields.name, testedFields.number, testedFields.email]);
            return res.status(201).json(testedFields);
        } else {
            return res.status(400).json(testedFields);
        }

    } catch (error) {
        console.log(error);
        if (error.code === "23505") {
            if (error.constraint?.includes("email")) {
            return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
            }
            if (error.constraint?.includes("numero")) {
                return res.status(409).json({ erro: "Este número de aluno já está em uso." });
            }
        }
        res.status(500).json({ error: "An error has ocurred." });
    }
}