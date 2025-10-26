export interface Token {
  id: string;
  name: string;
  createdAt: string;
  createdByUid: string;
  lastUsedAt?: string;
  token?: string; // Only present in creation response
}

export interface CreateTokenRequest {
  name: string;
}
