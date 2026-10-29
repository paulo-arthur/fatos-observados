import { Router } from "express";
import { listFOs, getFOById, getFOsOfStudent, createNewFO, judgeFO } from "../controllers/foController.js";
import { requireCaptain } from "../middlewares/capMiddleware.js";
import { validateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", validateJWT, listFOs);
router.get("/:id", validateJWT, getFOById);
router.get("/student/:studentId", validateJWT, getFOsOfStudent);

router.post("/", validateJWT, createNewFO);

router.patch("/:id", validateJWT, requireCaptain, judgeFO);

export default router;