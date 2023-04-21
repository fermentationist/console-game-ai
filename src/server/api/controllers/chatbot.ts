import { Request, Response } from "express";
import * as chatbotService from "../services/chatbot.js";

export const getChatbotResponse = async (req: Request, res: Response) => {
  const { messages, temperature } = req.body;
  try {
    const completion = await chatbotService.getChatbotResponse(
      messages as chatbotService.ChatMessage[],
      temperature as number | undefined
    );
    return res.send({ completion });
  } catch (error) {
    console.log("Error getting chatbot response:");
    console.error(error);
    return res.status(500).send({ error: "Error getting chatbot response" });
  }
};
