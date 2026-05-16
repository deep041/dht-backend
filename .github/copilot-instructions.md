# Node.js Backend Project Guidelines

## Database

- All database-related schema changes must be added inside:

prisma/schema.prisma

- Use Prisma ORM for all database operations.
- After schema updates, generate migrations properly.
- Keep model names clear and singular.

---

## Feature Structure

Whenever creating a new feature:

1. Create controller file inside:

controllers/

Example:

controllers/user.controller.js

2. Create route file inside:

routes/

Example:

routes/user.routes.js

3. After creating new controller or route files, add exports/imports in the respective `index.js` file of that folder.

Example:

controllers/index.js
routes/index.js

- Every new feature must be properly registered in index files.

---

## Controllers

- Keep controller logic clean and minimal.
- Business logic should be separated into services when needed.
- Use async/await for all asynchronous operations.
- Always wrap async APIs with try/catch.

---

## Response Handling

- Always send API responses using the common `sendResponse` utility function.
- Do not send raw `res.json()` directly from controllers unless absolutely necessary.

Example:

sendResponse(res, {
  success: true,
  message: 'User fetched successfully',
  data
});

---

## Routing Standards

- Keep routes RESTful.
- Use proper HTTP methods:
  - GET
  - POST
  - PUT
  - PATCH
  - DELETE

- Group feature routes properly.

---

## Code Standards

- Use ES modules/CommonJS consistently across project.
- Avoid duplicate logic.
- Keep files modular and reusable.
- Use proper error handling.
- Use environment variables for secrets/configs.
- Avoid hardcoded values.
- Prefer reusable utilities and middleware.

---

## Naming Conventions

- Controllers:
  feature.controller.js

- Routes:
  feature.routes.js

- Services:
  feature.service.js

- Prisma models:
  Singular PascalCase

Example:
User
Product
Order