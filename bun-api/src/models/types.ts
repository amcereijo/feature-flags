// Feature flag model
export interface Feature {
  id: number;
  name: string;
  value: string | number | boolean;
  valueType: "string" | "number" | "boolean";
  resourceId?: string;
  active: boolean;
  createdAt: string; // ISO date string
}

export interface FeatureDb {
  id: number;
  name: string;
  value: string;
  value_type: "string" | "number" | "boolean";
  resource_id: string;
  active: boolean;
  created_at: string; // ISO date string
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

export interface ApiTokenDb {
  id: number;
  name: string;
  token: string;
  created_at: string; // ISO date string
  last_used_at?: string; // ISO date string or undefined
  created_by_uid?: string;
}
