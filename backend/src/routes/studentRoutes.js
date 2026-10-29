import { Router } from "express";
import { listStudents, getStudentById, createNewStudent } from "../controllers/studentController.js";
import { validateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", validateJWT, listStudents);
router.get("/:id", validateJWT, getStudentById);

router.post("/", validateJWT, createNewStudent);

export default router;