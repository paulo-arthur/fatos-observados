import { Router } from "express";
import { listFOs } from "../controllers/foController.js";

const router = Router();

router.get("/", listFOs);

export default router;