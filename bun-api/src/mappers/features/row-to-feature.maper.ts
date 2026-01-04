import type { Feature, FeatureDb } from "../../models/types";

// Utility to map DB row to Feature type
export function mapFeature(row: FeatureDb): Feature {
  const valueType = row.value_type;

  let value: string | number | boolean;
  if (valueType === "number") {
    value = Number(row.value);
  } else if (valueType === "boolean") {
    value = row.value === "true" || row.value === "1";
  } else {
    value = row.value;
  }

  return {
    id: row.id,
    name: row.name,
    value,
    valueType,
    resourceId: row.resource_id || undefined,
    active: !!row.active,
    createdAt: row.created_at,
  };
}
