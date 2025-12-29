import { handleRequest } from "./src/routes/index";

// Configuración básica
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

console.log(`🚀 Bun API server starting on http://localhost:${PORT}`);

// Servidor HTTP principal usando la API nativa de Bun
Bun.serve({
  port: PORT,
  fetch: async (req: Request) => {
    // Manejo centralizado de rutas
    return await handleRequest(req);
  },
  error(error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  },
});
