import { Router } from "express";
import { getImage } from "../controllers/generatedImage.js";
import { getChatbotResponse } from "../controllers/chatbot.js";

const router = Router();

router.get("/generated_image", getImage);

router.post("/chat", getChatbotResponse);

export default router;
