import { Router, Request, Response } from "express";
import { getImage } from "../dall-e.js";

const router = Router();

router.get("/generated_image", async (req: Request, res: Response) => {
  const { prompt, style } = req.query;
  const imageUrl = await getImage(prompt as string, { style: style as string });
  res.send({ imageUrl });
});

export default router;
