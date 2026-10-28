import { Router } from "express";
import { listFOs, getFOById, getFOsOfStudent, createNewFO } from "../controllers/foController.js";

const router = Router();

router.get("/", listFOs);
router.get("/:id", getFOById);
router.get("/student/:studentId", getFOsOfStudent);

router.post("/", createNewFO);

export default router;