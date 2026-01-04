import { Database } from "bun:sqlite";

export class DeleteTokenUseCase {
  constructor(private readonly db: Database) {}

  async execute(id: number): Promise<boolean> {
    const row = this.db.query("SELECT * FROM api_tokens WHERE id = ?").get(id);

    if (!row) {
      return false;
    }

    this.db.run("DELETE FROM api_tokens WHERE id = ?", [id]);
    return true;
  }
}
