import type { ApiToken, ApiTokenDb } from "../../models/types";

// Utility to map DB row to ApiToken type
export function mapApiToken(row: ApiTokenDb): ApiToken {
  return {
    id: row.id,
    name: row.name,
    token: row.token,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at || undefined,
    createdByUid: row.created_by_uid || undefined,
  };
}
