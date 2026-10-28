import { Router } from "express";
import { createNewInstructor, getInstructorById, listInstructors, toggleInstructorState } from "../controllers/instructorController.js";

const router = Router();

router.get("/", listInstructors);
router.get("/:id", getInstructorById);

router.post("/", createNewInstructor);

router.patch("/:id", toggleInstructorState);

export default router;