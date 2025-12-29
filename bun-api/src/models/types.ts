// Feature flag model
export interface Feature {
  id: number;
  name: string;
  value: string;
  resourceId?: string;
  active: boolean;
  createdAt: string; // ISO date string
}

// API token model
export interface ApiToken {
  id: number;
  name: string;
  token: string;
  createdAt: string; // ISO date string
  lastUsedAt?: string; // ISO date string or undefined
  createdByUid?: string;
}
