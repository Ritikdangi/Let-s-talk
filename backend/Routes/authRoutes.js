import express from "express";
import mongoose from "mongoose";
import { Login, Logout, Register, Me } from "../Controllers/user.js"; // Add `.js` to imports
import AuthMiddleware from "../Middlewares/Auth.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);

// Protected route to get current authenticated user info (works with cookie or Authorization header)
router.get('/me', AuthMiddleware, Me);

export default router;
