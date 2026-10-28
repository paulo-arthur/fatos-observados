import { Router } from "express";
import { listFOs, getFOById, getFOsOfStudent, createNewFO, judgeFO } from "../controllers/foController.js";

const router = Router();

router.get("/", listFOs);
router.get("/:id", getFOById);
router.get("/student/:studentId", getFOsOfStudent);

router.post("/", createNewFO);

router.patch("/:id", judgeFO);

export default router;