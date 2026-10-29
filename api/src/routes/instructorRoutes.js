import { Router } from "express";
import { createNewInstructor, getInstructorById, listInstructors, toggleInstructorState } from "../controllers/instructorController.js";
import { validateJWT } from "../middlewares/authMiddleware.js";
import { requireCaptain } from "../middlewares/capMiddleware.js";

const router = Router();

router.get("/", validateJWT, listInstructors);
router.get("/:id", validateJWT, getInstructorById);

router.post("/", validateJWT, requireCaptain, createNewInstructor);

router.patch("/:id", validateJWT, requireCaptain, toggleInstructorState);

export default router;