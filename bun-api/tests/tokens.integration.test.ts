import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { spawn } from "bun";
import path from "path";

const BASE_PORT = 3457;
const BASE_URL = `http://localhost:${BASE_PORT}`;
let adminToken: string;
let createdTokenId: number;
let createdToken: string;
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

  // In test mode with mocked Clerk, any request will pass authentication
  adminToken = "test-admin-token";
});

describe("Tokens API", () => {
  it("should create an API token", async () => {
    const res = await fetch(`${BASE_URL}/api/tokens`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "integration-token" }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("integration-token");
    expect(typeof data.token).toBe("string");
    expect(data.id).toBeDefined();
    createdTokenId = data.id;
    createdToken = data.token;
  });

  it("should list API tokens and include the created token", async () => {
    const res = await fetch(`${BASE_URL}/api/tokens`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.some((t: any) => t.id === createdTokenId)).toBe(true);
  });

  it("should allow using the created token to access protected endpoints", async () => {
    // Use the newly created token to access /api/features (GET)
    const res = await fetch(`${BASE_URL}/api/features`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${createdToken}`,
      },
    });
    // Should be 200 (whether features exist or empty array)
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("should delete the created API token", async () => {
    const res = await fetch(`${BASE_URL}/api/tokens/${createdTokenId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(res.status).toBe(204);
  });

  it("should not find the deleted token in the list", async () => {
    const res = await fetch(`${BASE_URL}/api/tokens`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.some((t: any) => t.id === createdTokenId)).toBe(false);
  });
});

afterAll(async () => {
  // Stop the Bun server
  if (serverProcess) {
    serverProcess.kill();
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
});
