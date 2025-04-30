import express from "express";
const router = express.Router();
 import { AllUser } from "../Controllers/user.js";
 import AuthMiddleware from "../Middlewares/Auth.js"; 

 router.get("/users" , AuthMiddleware , AllUser );

 export default router;
