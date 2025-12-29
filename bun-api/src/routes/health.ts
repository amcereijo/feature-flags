// Health check route for Bun API

export const healthRoute = {
  path: "/health",
  method: "GET",
  handler: async (_req: Request): Promise<Response> => {
    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
};
