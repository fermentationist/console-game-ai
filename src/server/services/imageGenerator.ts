import { getImage as getOpenaiImage } from "./openai.js";

export async function getImage(prompt: string, style?: string) {
  const modifiedPrompt = `An detailed image,${
    style ? ` in the style of ${style},` : ""
  } of the following description of an object or location: """ ${prompt} """`;
  return getOpenaiImage(modifiedPrompt);
}
