import { pool } from  "../db.js";
import bcrypt from 'bcrypt';
import { sanitizeLogin } from "../utils/sanitizers.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
const { email, password } = req.body;
    try {
        const testedFields = sanitizeLogin(email, password);

        if (testedFields.isValid) {
            const query = `
                SELECT id, nome, posto, email, ativo, senha_hash
                FROM instrutores
                WHERE email = $1 
            `;
            const values = [ testedFields.email ];

            const result = await pool.query(query, values);
            const instructor = result.rows[0]; 

            if (instructor) {
                if (await bcrypt.compare(testedFields.password, instructor.senha_hash) && instructor.ativo) {
                    const token = jwt.sign(
                        {
                            id: instructor.id,
                            name: instructor.nome,
                            email: instructor.email,
                            rank: instructor.posto
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: "24h" }
                    );

                    return res.status(200).json({
                        message: "Login successful.",
                        token,
                        instructor: {
                            id: instructor.id,
                            name: instructor.nome,
                            rank: instructor.posto,
                            email: instructor.email
                        }
                    });
                } else {
                    return res.status(401).json( { error: "Invalid credentials." } );
                }
            } else {
                return res.status(401).json( { error: "Invalid credentials." } );
            }

        } else {
            return res.status(400).json(testedFields);
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error has occurred." });
    }
};