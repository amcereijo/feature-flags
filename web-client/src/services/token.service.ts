import { ApiClient } from "./api.client";
import type { CreateTokenRequest, Token } from "../types/token.types";

const TOKENS_PATH = "/tokens";

export class TokenService {
  private apiClient: ApiClient;

  constructor(getToken: () => Promise<string | null>) {
    this.apiClient = ApiClient.getInstance(getToken);
  }

  async create(request: CreateTokenRequest): Promise<Token> {
    return this.apiClient.post<Token>(TOKENS_PATH, request);
  }

  async list(): Promise<Token[]> {
    return this.apiClient.get<Token[]>(TOKENS_PATH);
  }

  async delete(id: string): Promise<void> {
    await this.apiClient.delete(`${TOKENS_PATH}/${id}`);
  }
}
