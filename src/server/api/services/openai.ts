import "dotenv/config";
import {
  Configuration,
  CreateModerationResponseResultsInner,
  OpenAIApi,
} from "openai";

export type ChatRole = "user" | "system" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

// categories that will be policed by the failsModeration function
export const DEFAULT_POLICED_CATEGORIES = [
  "hate",
  "hate/threatening",
  // "self-harm",
  // "sexual",
  "sexual/minors",
  // "violence",
  // "violence/graphic",
];

// maximum number of tokens that can be sent to the OpenAI API
export const TOKEN_LIMIT = 4097;

// initialize OpenAI API
let configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
let openai = new OpenAIApi(configuration);

// getModeration returns a promise that resolves to the response from the OpenAI API createModeration endpoint
export async function getModeration(
  input: string,
  apiKey?: string
): Promise<CreateModerationResponseResultsInner> {
  if (apiKey) {
    // if an API key is passed in, use it
    configuration = new Configuration({
      apiKey,
    });
    openai = new OpenAIApi(configuration);
  }
  const response = await openai.createModeration({ input });
  const results = response?.data?.results?.[0];
  return results;
}

// failsModeration returns the category of violation (a string) if the input fails moderation, or false if it passes
export async function failsModeration(
  input: string,
  {
    policedCategories = DEFAULT_POLICED_CATEGORIES,
    apiKey,
  }: { policedCategories?: string[]; apiKey?: string } = {}
) {
  const { categories } = await getModeration(input, apiKey);
  for (const category in categories) {
    const isInViolation =
      categories[category as keyof typeof categories] &&
      policedCategories.includes(category);
    if (isInViolation) {
      return category;
    }
  }
  return false;
}

export const getModels = async () => {
  const response = await openai.listModels();
  return response.data;
};

// tokenEstimate returns the estimated number of tokens that will be used by the OpenAI API to generate a response, given an array of messages
export const tokenEstimate = (messages: ChatMessage[]) => {
  const textContent = messages
    .map(message => `${message.role}: ${message.content}`)
    .join(" ");
  const wordCount = textContent.split(/[\s,.-]/).length;
  return Math.round(wordCount * 1.5);
};

// getCompletion returns a promise that resolves to the response from the OpenAI API createCompletion endpoint
export async function getCompletion(
  messages: ChatMessage[],
  {
    temperature = 0.95,
    maxTokens,
    model,
    apiKey,
  }: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
    apiKey?: string;
  } = {}
) {
  if (apiKey) {
    // if an API key is passed in, use it
    configuration = new Configuration({
      apiKey,
    });
    openai = new OpenAIApi(configuration);
  }
  try {
    console.log("Getting completion from OpenAI API...");
    const estimatedPromptTokens = tokenEstimate(messages);
    let difference = Math.floor(TOKEN_LIMIT * 0.75) - estimatedPromptTokens;
    difference =
      difference < 0 ? Math.floor(TOKEN_LIMIT * 0.75) + difference : difference;
    performance.mark("start");
    const response = await openai.createChatCompletion({
      model: model ?? "text-davinci-003",
      messages,
      max_tokens: maxTokens ?? difference,
      temperature,
    });
    console.log("\nGPT model used:", response?.data?.model);
    console.log("Total tokens:", response?.data?.usage?.total_tokens);
    return (
      response?.data?.choices && response.data.choices?.[0]?.message?.content
    );
  } catch (error: any) {
    // do not return error to the user
    console.log("Error getting completion from OpenAI API:");
    console.error(error.response?.data?.error ?? error);
    if (error.response?.data?.error?.type === "server_error") {
      return `My apologies, but I can't talk right now. Please come back later.`;
    }
  } finally {
    performance.mark("end");
    const measurement = performance.measure("createCompletion", "start", "end");
    console.log(
      "Time to run: ",
      parseFloat((measurement.duration / 1000).toFixed(2)),
      "s"
    );
  }
}

export async function getImage(
  prompt: string,
  {
    apiKey,
  }: {
    apiKey?: string;
  } = {}
) {
  if (apiKey) {
    // if an API key is passed in, use it
    configuration = new Configuration({
      apiKey,
    });
    openai = new OpenAIApi(configuration);
  }
  try {
    console.log("Getting image from DALL-E API...");
    performance.mark("start");
    const response = await openai.createImage({
      n: 1,
      prompt,
      response_format: "url",
      size: "1024x1024",
    });
    return response?.data?.data?.[0]?.url;
  } catch (error) {
    console.log("Error getting image from OpenAI API:");
    console.error(error);
  } finally {
    performance.mark("end");
    const measurement = performance.measure("createImage", "start", "end");
    console.log(
      "Time to run: ",
      parseFloat((measurement.duration / 1000).toFixed(2)),
      "s"
    );
  }
}
