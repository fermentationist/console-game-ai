import { Request, Response } from "express";
import * as imageService from "../services/imageGenerator.js";

export const getImage = async (req: Request, res: Response) => {
  const { prompt, style } = req.query;
  const imageUrl = await imageService.getImage(
    prompt as string,
    style as string
  );
  res.send({ imageUrl });
};
