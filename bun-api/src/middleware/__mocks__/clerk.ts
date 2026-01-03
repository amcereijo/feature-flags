import type { Context } from "elysia";

/**
 * Mock Clerk middleware for use in tests.
 * This middleware simulates a valid authenticated session and user.
 * Attach this mock using jest.mock or Bun's test mocking system.
 */
export const clerkMiddleware = async (
  ctx: Context,
  next: () => Promise<any>,
) => {
  // Simulate a valid user/session for testing
  (ctx.store as any).user = {
    id: "test-user-id",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    // Add any other fields your app expects from Clerk's user object
  };
  (ctx.store as any).session = {
    id: "test-session-id",
    userId: "test-user-id",
    // Add any other fields your app expects from Clerk's session object
  };
  return await next();
};
