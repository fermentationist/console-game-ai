import ApiRequest from "./ApiRequest";

export default class ImageRequest extends ApiRequest {
  constructor(prompt: string, style?: string) {
    super({
      url: "/api/generated_image",
      params: style ? { prompt, style } : { prompt },
    });
  }

  async getImageUrl() {
    const response = await this.request();
    return response?.imageUrl;
  }
}
