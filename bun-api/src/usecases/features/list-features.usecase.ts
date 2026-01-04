import { Database } from "bun:sqlite";
import { mapFeature } from "../../mappers/features/row-to-feature.maper";
import type { FeatureDb, Feature } from "../../models/types";

export class ListFeatures {
  constructor(private readonly db: Database) {}

  async execute(): Promise<Feature[]> {
    const rows = this.db
      .query<FeatureDb, []>("SELECT * FROM features")
      .all();

    return rows.map(mapFeature);
  }
}
