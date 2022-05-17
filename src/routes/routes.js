import { Router } from "express";
import { methods as routeController } from "../controllers/controllers.js";
import { methods as routeOulets } from "../controllers/oulets.js";

const router = Router()

router.post("/",routeController.test)
router.get("/:ip/:idDispositivo/:estadoDispositivos/:repeatCommand",routeController.getSData)
router.get("/:ip/:idDispositivo",routeOulets.getSData)

export default router