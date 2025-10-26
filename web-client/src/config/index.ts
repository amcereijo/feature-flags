interface Config {
  apiHost: string;
  apiPort: string;
  apiBaseUrl: string;
}

export const config: Config = {
  apiHost: import.meta.env.VITE_API_HOST || "http://localhost",
  apiPort: import.meta.env.VITE_API_PORT || "8080",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
};
