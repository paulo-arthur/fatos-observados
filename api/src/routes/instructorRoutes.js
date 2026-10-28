import { Router } from "express";
import { getInstructorById, listInstructors } from "../controllers/instructorController.js";

const router = Router();

router.get("/", listInstructors);
router.get("/:id", getInstructorById);

export default router;