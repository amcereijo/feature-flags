export type FeatureValueType = "boolean" | "string" | "number";

export interface Feature {
  id?: string;
  name: string;
  value: boolean | string | number;
  valueType: FeatureValueType;
  resourceId: string;
  active: boolean;
}

export interface FeatureFormData extends Omit<Feature, "id"> {
  value: boolean | string | number;
  valueType: FeatureValueType;
}

export const getDefaultValueForType = (
  type: FeatureValueType
): boolean | string | number => {
  switch (type) {
    case "boolean":
      return false;
    case "string":
      return "";
    case "number":
      return 0;
  }
};

export const parseValueByType = (
  value: string | number | boolean,
  type: FeatureValueType
): boolean | string | number => {
  switch (type) {
    case "boolean":
      return Boolean(value);
    case "string":
      return String(value);
    case "number": {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    }
  }
};
