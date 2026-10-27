import express from 'express';
import cors from 'cors';

import fosRoutes from './routes/foRoutes.js'; 

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/listfos', fosRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
})