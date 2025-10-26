import { ApiClient } from "./api.client";
import type { Feature, FeatureValueType } from "../types/feature.types";

export class FeatureService {
  private apiClient: ApiClient;

  constructor(getToken: () => Promise<string | null>) {
    this.apiClient = ApiClient.getInstance(getToken);
  }

  async getAllFeatures(): Promise<Feature[]> {
    return this.apiClient
      .get<Feature[]>("/features")
      .then((features) => features.map(parseFeature));
  }

  async getFeaturesByResource(resourceId: string): Promise<Feature[]> {
    return this.apiClient
      .get<Feature[]>(`/features?resourceId=${resourceId}`)
      .then((features) => features.map(parseFeature));
  }

  async getFeature(id: string): Promise<Feature> {
    return this.apiClient.get<Feature>(`/features/${id}`).then(parseFeature);
  }

  async createFeature(feature: Omit<Feature, "id">): Promise<Feature> {
    return this.apiClient.post<Feature>("/features", feature);
  }

  async updateFeature(id: string, feature: Feature): Promise<Feature> {
    return this.apiClient.put<Feature>(`/features/${id}`, feature);
  }

  async deleteFeature(id: string): Promise<void> {
    await this.apiClient.delete(`/features/${id}`);
  }
}

function parseFeature(feature: Feature): Feature {
  let valueType: FeatureValueType = "string";

  if (typeof feature.value === "boolean") {
    valueType = "boolean";
  } else if (typeof feature.value === "number") {
    valueType = "number";
  }

  return {
    ...feature,
    valueType,
  };
}
