import { Router } from "express";
import { listFOs, getFOById } from "../controllers/foController.js";

const router = Router();

router.get("/", listFOs);
router.get("/:id", getFOById);

export default router;