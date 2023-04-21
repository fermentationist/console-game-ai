import {
  getCompletion,
  failsModeration,
  ChatMessage as _ChatMessage,
} from "./openai.js";
export { ChatRole } from "./openai.js";
export interface ChatMessage extends _ChatMessage {}

export async function getChatbotResponse(
  messages: ChatMessage[],
  temperature?: number
) {
  const lastMessage = messages[messages.length - 1];
  const contentViolation = await failsModeration(lastMessage.content);
  if (contentViolation) {
    return `Sorry, your message was flagged as ${contentViolation}. Please try again.`;
  }
  const completion = await getCompletion(messages, {
    model: "gpt-3.5-turbo-0301",
    temperature,
  });
  return completion;
}
