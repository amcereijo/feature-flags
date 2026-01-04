import { Database } from "bun:sqlite";

export class DeleteFeature {
  constructor(private readonly db: Database) {}

  async execute(id: number): Promise<boolean> {
    const row = this.db
      .query("SELECT * FROM features WHERE id = ?")
      .get(id);

    if (!row) {
      return false;
    }

    this.db.run("DELETE FROM features WHERE id = ?", [id]);
    return true;
  }
}
