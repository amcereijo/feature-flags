import { Database } from "bun:sqlite";
import { mapApiToken } from "../../mappers/tokens/row-to-token.mapper";
import type { ApiTokenDb, ApiToken } from "../../models/types";

export class ListTokens {
  constructor(private readonly db: Database) {}

  async execute(): Promise<ApiToken[]> {
    const rows = this.db
      .query<ApiTokenDb, []>("SELECT * FROM api_tokens")
      .all();

    return rows.map(mapApiToken);
  }
}
