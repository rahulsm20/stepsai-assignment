import express from "express";
import { Login, Profile, Signup, Logout } from "../controllers/auth";
const router = express.Router();

router.post("/login", Login);
router.post("/signup", Signup);
router.get("/profile", Profile);
router.get("/logout", Logout);

export default router;
