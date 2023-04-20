export interface ApiRequestOptions {
  url: string;
  params?: Record<string, string>;
  body?: Record<string, any>;
  method?: string;
  headers?: Record<string, string>;
}

export default class ApiRequest {
  url: string;
  params?: Record<string, string>;
  body?: Record<string, any>;
  method: string;
  headers?: Record<string, string>;
  abortController: AbortController;
  requestPending = false;

  constructor({ url, params, body, method, headers }: ApiRequestOptions) {
    this.url = url;
    this.params = params;
    this.body = body;
    this.method = method || "GET";
    this.headers = headers || { "Content-Type": "application/json" };
    this.abortController = new AbortController();
  }

  async request({
    method,
    url,
    body,
    params,
    headers,
  }: {
    method?: string;
    url?: string;
    body?: Record<string, any>;
    params?: Record<string, string>;
    headers?: Record<string, string>;
  } = {}) {
    this.requestPending = true;
    const urlWithParams =
      params || this.params
        ? (url ?? this.url) + "?" + new URLSearchParams(params || this.params)
        : url ?? this.url;
    const config = {
      method: method || this.method,
      signal: this.abortController.signal,
      body: (body || this.body) && JSON.stringify(body || this.body),
      headers: headers || this.headers,
    };
    const response = await fetch(urlWithParams, config)
      .then(res => res.json())
      .catch(error => {
        // do nothing
      })
      .finally(() => {
        this.requestPending = false;
      });
    return response;
  }

  abort() {
    if (this.requestPending) {
      this.requestPending = false;
      this.abortController.abort();
    }
  }
}
