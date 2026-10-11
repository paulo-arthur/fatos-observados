import express from "express";
import cors from "cors";
import "dotenv/config";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { authRouter } from "./routes/auth.routes.js";
import { assertJwtSecret } from "./lib/jwt.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);

app.get("/health", (req, res) => {
  return res.json({ status: "ok" });
});

export { app };

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assertJwtSecret();
  const port = Number(process.env.PORT) || 3333;
  app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
}
