export default class ImageRequest {
  url: string;
  params: Record<string, string>;
  requestPending = false;
  abortController: AbortController;
  constructor(prompt: string, style?: string) {
    this.url = "/api/generated_image";
    this.params = style ? { prompt, style } : { prompt };
    this.abortController = new AbortController();
  }
  async request() {
    this.requestPending = true;
    const response = await fetch(
      this.url + "?" + new URLSearchParams(this.params),
      {
        signal: this.abortController.signal,
      }
    )
      .then((res) => {
        return res.json();
      })
      .catch((error) => {
        // do nothing
      })
      .finally(() => {
        this.requestPending = false;
      });
    return response?.imageUrl;
  }
  abort() {
    if (this.requestPending) {
      this.requestPending = false;
      this.abortController.abort();
    }
  }
}
