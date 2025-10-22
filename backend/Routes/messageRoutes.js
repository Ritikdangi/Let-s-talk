import express from "express";
import { SendMessage, GetMessage, EditMessage, ReactMessage } from "../Controllers/message.js";
import AuthMiddleware from "../Middlewares/Auth.js";
const router = express.Router();

router.post("/send/:id" ,AuthMiddleware, SendMessage);
router.get("/get/:id", AuthMiddleware, GetMessage);
router.put('/edit/:id', AuthMiddleware, EditMessage);
// small debug wrapper to log react requests
router.post('/react/:id', AuthMiddleware, (req, res, next) => {
	try { console.debug('POST /api/message/react/:id', { params: req.params, body: req.body, user: req.user && { userId: req.user.userId } }); } catch (e) {}
	next();
}, ReactMessage);

export default router;