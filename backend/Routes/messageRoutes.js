import express from "express";
import { SendMessage ,GetMessage } from "../Controllers/message.js";
import AuthMiddleware from "../Middlewares/Auth.js";
const router = express.Router();

router.post("/send/:id" ,AuthMiddleware, SendMessage);
router.get("/get/:id", AuthMiddleware, GetMessage);

export default router;