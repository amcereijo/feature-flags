interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;
  private getToken: () => Promise<string | null>;

  private constructor(getToken: () => Promise<string | null>) {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    this.getToken = getToken;
  }

  static getInstance(getToken: () => Promise<string | null>): ApiClient {
    if (!ApiClient.instance || ApiClient.instance.getToken !== getToken) {
      ApiClient.instance = new ApiClient(getToken);
    }
    return ApiClient.instance;
  }

  private async getHeaders(options?: RequestOptions): Promise<Headers> {
    const headers = new Headers(options?.headers);

    // Set basic content headers
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    if (!options?.skipAuth) {
      const token = await this.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return headers;
  }

  async request<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = await this.getHeaders(options);

    const response = await fetch(url, {
      ...options,
      headers,
      mode: "cors",
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    // Handle no-content responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  async post<T, D = unknown>(
    path: string,
    data?: D,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T, D = unknown>(
    path: string,
    data?: D,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(path: string, options?: RequestOptions): Promise<void> {
    await this.request(path, { ...options, method: "DELETE" });
  }
}
