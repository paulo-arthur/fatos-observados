import { Router } from "express";
import { listStudents, getStudentById } from "../controllers/studentController.js";

const router = Router();

router.get("/", listStudents);
router.get("/:id", getStudentById);

export default router;