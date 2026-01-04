import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { spawn } from "bun";
import path from "path";

const BASE_PORT = 3456;
const BASE_URL = `http://localhost:${BASE_PORT}`;
let token: string;
let featureId: number;
let serverProcess: any;

beforeAll(async () => {
  // Start the Bun server as a subprocess with TEST_MODE enabled
  serverProcess = spawn({
    cmd: ["bun", "index.ts"],
    cwd: path.resolve(__dirname, ".."),
    env: {
      ...process.env,
      PORT: BASE_PORT.toString(),
      NODE_ENV: "test",
    },
    stdout: "pipe",
    stderr: "pipe",
  });

  // Wait for the server to be ready
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Create a test token directly using the API
  // In test mode with mocked Clerk, any request will pass authentication
  const res = await fetch(`${BASE_URL}/api/tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer test-token`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "integration-test-token" }),
  });

  if (res.status !== 201 && res.status !== 200) {
    const errorText = await res.text();
    console.error("Failed to create token:", res.status, errorText);
    throw new Error(`Failed to create test token: ${res.status}`);
  }

  const data = await res.json();
  console.log("Token creation response:", data);
  token = data.token || "test-token-fallback";
});

describe("Features API", () => {
  it("should create a feature", async () => {
    const res = await fetch(`${BASE_URL}/api/features`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "test-feature",
        value: "true",
        valueType: "string",
      }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("test-feature");
    expect(data.value).toBe("true");
    expect(data.valueType).toBe("string");
    featureId = data.id;
  });

  it("should list features", async () => {
    const res = await fetch(`${BASE_URL}/api/features`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.some((f: any) => f.id === featureId)).toBe(true);
  });

  it("should get a feature by id", async () => {
    const res = await fetch(`${BASE_URL}/api/features/${featureId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe(featureId);
    expect(data.name).toBe("test-feature");
    expect(data.valueType).toBe("string");
  });

  it("should update a feature", async () => {
    const res = await fetch(`${BASE_URL}/api/features/${featureId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: "false" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.value).toBe("false");
  });

  it("should create a feature with number value type", async () => {
    const res = await fetch(`${BASE_URL}/api/features`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "test-number-feature",
        value: "42",
        valueType: "number",
      }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("test-number-feature");
    expect(data.value).toBe(42);
    expect(typeof data.value).toBe("number");
    expect(data.valueType).toBe("number");

    // Clean up
    await fetch(`${BASE_URL}/api/features/${data.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  it("should create a feature with boolean value type", async () => {
    const res = await fetch(`${BASE_URL}/api/features`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "test-boolean-feature",
        value: "true",
        valueType: "boolean",
      }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("test-boolean-feature");
    expect(data.value).toBe(true);
    expect(typeof data.value).toBe("boolean");
    expect(data.valueType).toBe("boolean");

    // Clean up
    await fetch(`${BASE_URL}/api/features/${data.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  it("should delete a feature", async () => {
    const res = await fetch(`${BASE_URL}/api/features/${featureId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(204);
  });
});

afterAll(async () => {
  // Stop the Bun server
  if (serverProcess) {
    serverProcess.kill();
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
});
