import { Router } from "express";
import { listStudents } from "../controllers/studentController.js";

const router = Router();

router.get("/", listStudents);

export default router;