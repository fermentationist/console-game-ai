import ApiRequest from "./ApiRequest";
import { ChatMessage, ChatRole } from "../server/api/services/chatbot";

const TOKEN_LIMIT = 4097;

export default class Chat extends ApiRequest {
  messages: ChatMessage[];
  characterName: string;
  name: string;
  initialMessage: ChatMessage;
  temperature?: number;

  constructor(
    botName: string,
    botInstructions: string,
    characterName?: string,
    temperature?: number
  ) {
    super({
      url: "/api/chat",
      method: "POST",
    });
    this.name = botName;
    this.characterName = characterName ?? botName;
    this.initialMessage = {
      content: `Your name is ${this.characterName}. ${botInstructions} `,
      role: "system" as ChatRole,
    };
    this.messages = [this.initialMessage];
    this.temperature = temperature;
  }

  async converse(messageContent: string) {
    const newMessage = {
      content: messageContent,
      role: "user" as ChatRole,
    };
    const newMessages = [...this.messages, newMessage];
    // Remove messages until we're under 75% of the token limit
    while (this.tokenEstimate(newMessages) > TOKEN_LIMIT * 0.75) {
      // Remove the second and third messages, which are the oldest user message and assistant response
      if (newMessages.length < 3) {
        break;
      }
      newMessages.splice(1, 2);
    }
    const response = await this.request({
      body: { messages: newMessages, temperature: this.temperature },
    });
    this.messages.push(newMessage, {
      content: response?.completion,
      role: "assistant" as ChatRole,
    });
    return response?.completion;
  }

  async reset() {
    this.messages = [this.initialMessage];
  }

  tokenEstimate(messages: ChatMessage[]) {
    const textContent = messages
      .map(message => `${message.role}: ${message.content}`)
      .join(" ");
    const wordCount = textContent.split(/[\s,.-]/).length;
    return Math.round(wordCount * 1.5);
  }
}
