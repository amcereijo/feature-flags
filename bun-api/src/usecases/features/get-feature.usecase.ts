import { Database } from "bun:sqlite";
import { mapFeature } from "../../mappers/features/row-to-feature.maper";
import type { FeatureDb, Feature } from "../../models/types";

export class GetFeature {
  constructor(private readonly db: Database) {}

  async execute(id: number): Promise<Feature | null> {
    const row = this.db
      .query<FeatureDb, {}>("SELECT * FROM features WHERE id = ?")
      .get(id);

    if (!row) {
      return null;
    }

    return mapFeature(row);
  }
}
