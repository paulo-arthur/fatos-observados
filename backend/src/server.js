import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import fosRoutes from './routes/foRoutes.js';
import studentsRoutes from './routes/studentRoutes.js';
import instructorRoutes from './routes/instructorRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste/healthcheck (para verificar o status no Koyeb)
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API FOs online e operacional!' });
});

app.use('/fos', fosRoutes);
app.use('/students', studentsRoutes);
app.use('/instructors', instructorRoutes);
app.use('/auth', authRoutes);

// Garante uma porta padrão caso process.env.PORT não venha definido
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});