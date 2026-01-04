import { Database } from "bun:sqlite";
import { mapFeature } from "../../mappers/features/row-to-feature.maper";
import type { FeatureDb, Feature } from "../../models/types";

export class CreateFeature {
  constructor(private readonly db: Database) {}

  async execute({ name, value, valueType, resourceId, active }: Feature) {
    const { lastInsertRowid } = this.db.run(
      `INSERT INTO features (name, value, resource_id, value_type, active) VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        value,
        resourceId || null,
        valueType,
        typeof active === "undefined" ? 1 : active ? 1 : 0,
      ],
    );

    // Get the last inserted feature
    const row = this.db
      .query<FeatureDb, {}>("SELECT * FROM features WHERE id = ?")
      .get(lastInsertRowid);

    if (!row) {
      throw new Error("Feature not found after creation");
    }

    return mapFeature(row);
  }
}
