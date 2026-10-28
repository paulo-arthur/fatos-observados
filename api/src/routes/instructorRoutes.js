import { Router } from "express";
import { createNewInstructor, getInstructorById, listInstructors } from "../controllers/instructorController.js";

const router = Router();

router.get("/", listInstructors);
router.get("/:id", getInstructorById);

router.post("/", createNewInstructor);

export default router;