import { Router, Request, Response } from "express";
import { getImage } from "../services/imageGenerator.js";
import { getChatbotResponse, ChatMessage } from "../services/chatbot.js";

const router = Router();

router.get("/generated_image", async (req: Request, res: Response) => {
  const { prompt, style } = req.query;
  const imageUrl = await getImage(prompt as string, style as string);
  res.send({ imageUrl });
});

router.post("/chat", async (req: Request, res: Response) => {
  const { messages, temperature } = req.body;
  try {
    const completion = await getChatbotResponse(messages as ChatMessage[], temperature as number | undefined);
    return res.send({ completion });
  } catch (error) {
    console.log("Error getting chatbot response:");
    console.error(error);
    return res.status(500).send({ error: "Error getting chatbot response" });
  }
});

export default router;
