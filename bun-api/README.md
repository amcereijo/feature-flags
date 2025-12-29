# bun-api

A feature flag service implemented in TypeScript using [Bun](https://bun.sh/), inspired by the original Go-based `api` service.

---

## Project Structure

```
bun-api/
├── src/
│   ├── controllers/   # Route handlers
│   ├── db/            # Database connection and queries
│   ├── middleware/    # Authentication and other middleware
│   ├── models/        # TypeScript types and interfaces
│   ├── routes/        # Route definitions
│   └── utils/         # Utility functions (e.g., JWT helpers)
├── tests/             # Integration tests
├── index.ts           # Entry point
├── package.json
├── tsconfig.json
└── README.md
```

---

## Features

- REST API for managing feature flags
- API token authentication (JWT)
- SQLite database (via Bun's built-in Database API)
- Health check endpoint

---

## Requirements

- [Bun](https://bun.sh/) v1.0+
- SQLite3

---

## Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Configure the database:**
   - By default, uses `feature-flags.db` in the project root.
   - You can change the path in `src/db/index.ts`.

3. **Run the server:**
   ```bash
   bun run index.ts
   ```

---

## Endpoints

- `POST /api/tokens` - Create API token
- `GET /api/tokens` - List API tokens
- `DELETE /api/tokens/:id` - Delete API token
- `POST /api/features` - Create feature flag
- `GET /api/features` - List all feature flags
- `GET /api/features/:id` - Get feature flag by ID
- `PUT /api/features/:id` - Update feature flag
- `DELETE /api/features/:id` - Delete feature flag
- `GET /health` - Health check

---

## Authentication

All endpoints except `/health` require a valid API token (JWT) in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens can be created using the `/api/tokens` endpoint.

---

## Example Usage

### 1. Create an API Token

```bash
curl -X POST http://localhost:3000/api/tokens \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "test-token"}'
```

### 2. Use the Token

Use the returned `token` field as the Bearer token for all subsequent requests.

### 3. Create a Feature Flag

```bash
curl -X POST http://localhost:3000/api/features \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "new-feature", "value": "true"}'
```

---

## Libraries Used

- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - JWT authentication
- [better-sqlite3](https://www.npmjs.com/package/better-sqlite3) - SQLite database driver

Bun's native APIs are used for the HTTP server and SQLite connection where possible.

---

## Testing

### Integration Tests

Los tests de integración verifican el flujo completo desde los endpoints HTTP hasta la base de datos SQLite.

#### Estructura sugerida

Coloca los tests en el directorio `tests/` y usa Bun para ejecutarlos.

#### Ejemplo de test de integración (`tests/features.integration.test.ts`):

```ts
import { afterAll, beforeAll, describe, expect, it } from "bun:test";

const BASE_URL = "http://localhost:3000";
let token: string;

beforeAll(async () => {
  // Crea un token de prueba (requiere que el servidor esté corriendo y un token admin válido)
  const res = await fetch(`${BASE_URL}/api/tokens`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer <admin-token>",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: "integration-test-token" })
  });
  const data = await res.json();
  token = data.token;
});

describe("Features API", () => {
  let featureId: number;

  it("should create a feature", async () => {
    const res = await fetch(`${BASE_URL}/api/features`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: "test-feature", value: "true" })
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("test-feature");
    featureId = data.id;
  });

  it("should list features", async () => {
    const res = await fetch(`${BASE_URL}/api/features`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("should get a feature by id", async () => {
    const res = await fetch(`${BASE_URL}/api/features/${featureId}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe(featureId);
  });

  it("should update a feature", async () => {
    const res = await fetch(`${BASE_URL}/api/features/${featureId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ value: "false" })
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.value).toBe("false");
  });

  it("should delete a feature", async () => {
    const res = await fetch(`${BASE_URL}/api/features/${featureId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    expect(res.status).toBe(204);
  });
});

afterAll(async () => {
  // Limpieza si es necesario
});
```

### Ejecutar los tests

```bash
bun test
```

---

## Notas

- Cambia el valor de `JWT_SECRET` en producción.
- Puedes modificar la estructura de la base de datos en `src/db/index.ts`.
- El servidor escucha en el puerto `3000` por defecto (puedes cambiarlo con la variable de entorno `PORT`).

---

## License

MIT
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.34. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
