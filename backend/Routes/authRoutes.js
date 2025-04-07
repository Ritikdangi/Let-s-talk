import express from "express";
import mongoose from "mongoose";
import { Login, Logout, Register } from "../Controllers/user.js"; // Add `.js` to imports

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
export default router;
