import exress from "express";
import {sendMessage} from "../controllers/message.controller.js"
import { protectRoute } from "../middleware/protectRoute.js";


const router = exress.Router()

router.post("/send/:id", protectRoute ,sendMessage)


export default router;