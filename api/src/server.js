import express from 'express';
import cors from 'cors';

import fosRoutes from './routes/foRoutes.js';
import studentsRoutes from './routes/studentRoutes.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/fos', fosRoutes);
app.use('/students', studentsRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
})