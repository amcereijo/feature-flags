import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { registerFeatureRoutes } from "./src/routes/features";
import { registerTokenRoutes } from "./src/routes/tokens";
import { registerHealthRoute } from "./src/routes/health";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = new Elysia();
app.use(cors());
// app.setMeta("description", "Elysia API for Feature Flags Management");

app.use(registerHealthRoute());
app.use(registerFeatureRoutes());
app.use(registerTokenRoutes());

app.onError(({ code, error }) => {
  console.error("Server error:", error);
  return new Response(JSON.stringify({ error: "Internal server error" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Elysia API server running at http://localhost:${PORT}`);
});
