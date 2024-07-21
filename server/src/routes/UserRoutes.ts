import express from "express";
import { addUpdateDoctor, getPatient } from "../controllers";
const router = express.Router();

router.post("/doctor", addUpdateDoctor);
router.get("/", getPatient);

export default router;
