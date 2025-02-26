# My Backend Structure

This is a backend project structured using **Fastify** and **TypeScript**. The folder organization follows best practices to facilitate maintenance and scalability.

## 📁 Folder Structure

```
my_backend_structure/
│── node_modules/      # Project dependencies (managed by pnpm)
│── prisma/            # Prisma ORM configuration
│   ├── migrations/    # Database migration files
│   ├── schema.prisma  # Database schema definition
│── private/           # Private files (e.g., configuration keys)
│── src/               # Main source code
│   ├── config/        # Application configuration (database, environment variables, etc.)
│   ├── controllers/   # Controllers logic (request handlers)
│   ├── routes/        # API route definitions
│   ├── schemas/       # Schema definitions and validations
│   ├── services/      # Business logic and reusable functions
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility helper functions
│   ├── server.ts      # Main Fastify server file
│── .env               # Environment variables
│── .gitignore         # Git ignored files
│── package.json       # Project configuration and dependencies
│── pnpm-lock.yaml     # Locked dependency versions
│── tsconfig.json      # TypeScript configuration
```

## 🚀 Technologies Used

- **Fastify** - A fast and efficient web framework for Node.js
- **TypeScript** - Static typing for JavaScript
- **Prisma** - A modern ORM for database management
- **Dotenv** - Environment variable management
- **PNPM** - An efficient package manager
- **Swagger UI** - Interactive API documentation

## 🔧 How to Run

1. Install dependencies:
   ```sh
   pnpm install
   ```

2. Configure environment variables in the `.env` file.

3. Run the application:
   ```sh
   pnpm run dev
   ```

4. Access the API documentation via Swagger UI at:
   ```
   http://localhost:port/docs
   ```

## 📌 Contributions

Feel free to contribute with improvements to this project. Suggestions and PRs are welcome!

---

📌 **Author:** Orlando Saiombo  


