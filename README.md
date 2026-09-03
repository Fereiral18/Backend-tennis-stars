# Backend Tennis Stars

REST API for **Tennis Stars**, an ecommerce for sports shoes (Nike, Adidas, Puma, Under Armour, New Balance, etc). Built with **NestJS**, **Prisma** and **PostgreSQL**, designed to serve the admin dashboard in `Frotend-tennis-stars`.

## Stack

- [NestJS 11](https://nestjs.com/) (Express platform)
- [Prisma 6](https://www.prisma.io/) + PostgreSQL
- JWT auth (`@nestjs/jwt` + `passport-jwt`)
- `class-validator` / `class-transformer` for request validation
- ESLint (flat config) + Prettier

## Project structure

```
src/
  common/            # cross-cutting concerns
    decorators/      # @Public, @Roles, @CurrentUser
    filters/         # global HttpExceptionFilter (Prisma-aware)
    guards/          # JwtAuthGuard, RolesGuard
    types/           # shared interfaces (AuthenticatedUser, JwtPayload)
    utils/           # Decimal -> number helper
  config/            # env validation (Joi) + typed config namespaces
  prisma/            # PrismaService/PrismaModule (global)
  modules/
    auth/            # login, /auth/me, JWT strategy
    categories/      # CRUD
    products/        # CRUD + filters (categoryId, search)
    sales/           # create sale, list, update status/payment-status
    dashboard/       # aggregated summary for the dashboard screen
  app.module.ts
  main.ts
prisma/
  schema.prisma
  seed.ts            # creates the admin user + demo categories/products
```

Each domain module follows the same shape: `*.controller.ts` (HTTP layer), `*.service.ts` (business logic + Prisma access), `dto/` (validated input), and a `*.types.ts` with the exact response shape consumed by the frontend.

## Data model

- **User**: admin account used to sign in to the dashboard (`role: ADMIN | USER`).
- **Category**: `name` (unique), `description`.
- **Product**: `name` (unique), `description`, `price`, `imageUrl`, belongs to a `Category`.
- **Sale**: customer info, shipping fields, `status`, `paymentMethod`, `paymentStatus`, `total`, and a list of `SaleItem` (product snapshot: name, quantity, unit price, subtotal).

Response payloads mirror the TypeScript types already defined in the frontend (`Product`, `Category`, `Sale`, `AuthResponse`, etc.), so wiring the frontend services to this API only means replacing the `mockStorage` calls with `api` (axios) calls.

## Getting started

### 1. Requirements

- Node.js 20+
- A running PostgreSQL instance

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL`, `JWT_SECRET` (min 16 chars), and `CORS_ORIGIN` (the frontend URL, e.g. `http://localhost:5173`).

### 4. Run migrations and seed data

```bash
npm run prisma:migrate     # creates the schema
npm run prisma:seed        # creates the admin user + demo categories/products
```

Seeded admin credentials: `admin@courtstore.com` / `123456` (same as the frontend mock, so the login form works unchanged).

### 5. Run the API

```bash
npm run start:dev
```

The API is served under `http://localhost:3000/api`.

## Scripts

| Script                    | Description                                   |
| -------------------------- | ---------------------------------------------- |
| `npm run start:dev`        | Start in watch mode                            |
| `npm run build`            | Compile to `dist/`                             |
| `npm run start:prod`       | Run the compiled app                           |
| `npm run lint`             | ESLint with `--fix`                            |
| `npm run test`             | Unit tests (Jest)                              |
| `npm run prisma:migrate`   | Create/apply a dev migration                   |
| `npm run prisma:studio`    | Open Prisma Studio                             |
| `npm run prisma:seed`      | Re-run the seed script                         |

## API overview

All routes are prefixed with `/api` and require `Authorization: Bearer <token>` unless marked **public**.

| Method | Route                          | Description                     |
| ------ | ------------------------------- | -------------------------------- |
| POST   | `/auth/login` *(public)*        | Returns `{ token, user }`        |
| GET    | `/auth/me`                      | Current authenticated user       |
| GET    | `/categories`                   | List categories                  |
| GET    | `/categories/:id`                | Get one category                 |
| POST   | `/categories`                   | Create category                  |
| PATCH  | `/categories/:id`                | Update category                  |
| DELETE | `/categories/:id`                | Delete category                  |
| GET    | `/products?categoryId&search`   | List products (optional filters) |
| GET    | `/products/:id`                  | Get one product                  |
| POST   | `/products`                     | Create product                   |
| PATCH  | `/products/:id`                  | Update product                   |
| DELETE | `/products/:id`                  | Delete product                   |
| GET    | `/sales`                        | List sales                       |
| GET    | `/sales/:id`                     | Get one sale                     |
| POST   | `/sales`                        | Create a sale                    |
| PATCH  | `/sales/:id/status`              | Update sale status               |
| PATCH  | `/sales/:id/payment-status`      | Update payment status            |
| GET    | `/dashboard/summary`            | Metrics + 5 most recent sales    |
| GET    | `/health` *(public)*             | Health check                     |

Errors follow a consistent shape:

```json
{
  "statusCode": 400,
  "message": ["..."],
  "error": "Bad Request",
  "path": "/api/categories",
  "timestamp": "2026-09-03T00:00:00.000Z"
}
```
