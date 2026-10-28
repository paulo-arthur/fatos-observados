import { Router } from "express";
import { listStudents, getStudentById, createNewStudent } from "../controllers/studentController.js";

const router = Router();

router.get("/", listStudents);
router.get("/:id", getStudentById);

router.post("/", createNewStudent);

export default router;