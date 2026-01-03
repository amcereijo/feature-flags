import { createClerkClient } from "@clerk/backend";
import type { Context } from "elysia";

// Initialize Clerk with your API key from environment variables
const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY || "",
});

/**
 * Elysia middleware for Clerk authentication.
 * Verifies the Clerk session token from the Authorization header.
 * Attaches the user and session to ctx.store if valid.
 * In test mode (NODE_ENV=test), authentication is bypassed.
 */
export const clerkMiddleware = async (ctx: Context) => {
  // Bypass authentication in test mode
  if (process.env.NODE_ENV === "test") {
    ctx.store = ctx.store || {};
    (ctx.store as any).userId = "test-user-id";

    return;
  }

  const authHeader = ctx.request.headers.get("authorization");
  if (!authHeader) {
    throw new Error("Unauthorized - No authorization header");
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const response = await clerk.authenticateRequest(ctx.request);

    if (!response.isSignedIn) {
      throw new Error("Unauthorized - Invalid Clerk session");
    }

    const auth = response.toAuth();
    (ctx.store as any).userId = auth.userId;
  } catch (err) {
    console.error("Clerk session verification failed:", err);
    throw new Error("Unauthorized - Invalid Clerk session");
  }
};
