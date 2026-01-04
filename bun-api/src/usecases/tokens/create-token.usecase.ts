import { Database } from "bun:sqlite";
import { mapApiToken } from "../../mappers/tokens/row-to-token.mapper";
import type { ApiTokenDb, ApiToken } from "../../models/types";
import { generateToken } from "../../utils/jwt";

export class CreateToken {
  constructor(private readonly db: Database) {}

  async execute({ name, createdByUid }: { name: string; createdByUid?: string }): Promise<ApiToken> {
    // Generate JWT as API token
    const token = generateToken({ name, uid: createdByUid || "" });

    this.db.run(
      `INSERT INTO api_tokens (name, token, created_by_uid) VALUES (?, ?, ?)`,
      [name, token, createdByUid || null],
    );

    // Get the last inserted token
    const row = this.db
      .query<ApiTokenDb, []>("SELECT * FROM api_tokens ORDER BY id DESC LIMIT 1")
      .get();

    if (!row) {
      throw new Error("Token not found after creation");
    }

    return mapApiToken(row);
  }
}
