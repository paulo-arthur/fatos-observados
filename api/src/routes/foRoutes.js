import { Router } from "express";
import { listFOs, getFOById, getFOsOfStudent } from "../controllers/foController.js";

const router = Router();

router.get("/", listFOs);
router.get("/:id", getFOById);
router.get("/student/:studentId", getFOsOfStudent)

export default router;