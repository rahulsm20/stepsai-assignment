import express from "express";
import {
  addInteraction,
  generateDetail,
  getInteractionById,
  getInteractions,
} from "../controllers";
const router = express.Router();

router.get("/", getInteractions);
router.post("/add", addInteraction);
router.post("/generate", generateDetail);
router.get("/:id", getInteractionById);

export default router;
