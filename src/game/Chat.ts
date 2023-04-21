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
    this.messages.push({
      content: messageContent,
      role: "user" as ChatRole,
    });
    // Remove messages until we're under 75% of the token limit
    while (this.tokenEstimate() > TOKEN_LIMIT * 0.75) {
      // Remove the second and third messages, which are the oldest user message and assistant response
      if (this.messages.length < 3) {
        break;
      }
      this.messages.splice(1, 2);
    }
    const response = await this.request({
      body: { messages: this.messages, temperature: this.temperature },
    });
    this.messages.push({
      content: response?.completion,
      role: "assistant" as ChatRole,
    });
    return response?.completion;
  }

  async reset() {
    this.messages = [this.initialMessage];
  }

  tokenEstimate() {
    const textContent = this.messages
      .map(message => `${message.role}: ${message.content}`)
      .join(" ");
    const wordCount = textContent.split(/[\s,.-]/).length;
    return Math.round(wordCount * 1.5);
  }
}
