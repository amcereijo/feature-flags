import { Database } from "bun:sqlite";
import { mapFeature } from "../../mappers/features/row-to-feature.maper";
import type { FeatureDb, Feature } from "../../models/types";

export class UpdateFeature {
  constructor(private readonly db: Database) {}

  async execute(
    id: number,
    updates: Partial<Feature>
  ): Promise<Feature | null> {
    // First check if feature exists
    const existingRow = this.db
      .query<FeatureDb, {}>("SELECT * FROM features WHERE id = ?")
      .get(id);

    if (!existingRow) {
      return null;
    }

    const { name, value, resourceId, active, valueType } = updates;

    this.db.run(
      `UPDATE features SET name = ?, value = ?, value_type = ?, resource_id = ?, active = ? WHERE id = ?`,
      [
        typeof name === "undefined" ? existingRow.name : name,
        typeof value === "undefined" ? existingRow.value : value,
        typeof valueType === "undefined" ? existingRow.value_type : valueType,
        typeof resourceId === "undefined" ? existingRow.resource_id : resourceId,
        typeof active === "undefined" ? existingRow.active : active ? 1 : 0,
        id,
      ],
    );

    const updated = this.db
      .query<FeatureDb, {}>("SELECT * FROM features WHERE id = ?")
      .get(id);

    if (!updated) {
      throw new Error("Feature not found after update");
    }

    return mapFeature(updated);
  }
}
