# Blog API

A RESTful blog API built with Node.js and TypeScript. This project provides endpoints for authentication, blog CRUD, comments, likes, and user management. It's organized with a clear `src/` structure including controllers, routes, models, middlewares and utility libraries such as Cloudinary integration, JWT helpers, mongoose connection helpers and logging.

## Highlights

- TypeScript-based Express server
- Modular route controllers (see `src/controllers/v1`)
- Authentication and JWT handling
- Blog posts, comments and like/unlike functionality
- Cloudinary support for uploading banners (`src/lib/cloudinary.ts`)
- Request rate-limiting and centralized logging

## Repository layout (important files/folders)

- `src/` - application source
  - `controllers/v1/` - route controller handlers (auth, blog, comment, like, user)
  - `routes/v1/` - Express route definitions
  - `models/` - Mongoose models
  - `lib/` - helpers (Cloudinary, JWT, mongoose connection, logger)
  - `middlewares/` - auth, authorization, file upload, validation handlers
  - `config/index.ts` - configuration loader
- `package.json` - project scripts & dependencies
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - file ignores

## Quick start

Prerequisites

- Node.js 16+ (or a maintained LTS)
- npm (or pnpm/yarn) installed
- MongoDB connection (remote or local)

Install dependencies

```pwsh
npm install
# or if you use pnpm or yarn:
# pnpm install
# yarn install
```

Environment

Create a `.env` file at the project root (not checked into git). Typical variables used by the app include:

- `PORT` - server port (defaults to 3000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret used to sign JWTs
- `JWT_EXPIRES_IN` - token lifetime (e.g. `1d`)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - cloudinary credentials
- `NODE_ENV` - `development` | `production`

Check `src/config/index.ts` for the exact variables required.

Run in development

```pwsh
npm run dev
```

Build and run

```pwsh
npm run build
npm start
```

Note: script names above (`dev`, `build`, `start`) are typical for TypeScript projects. If your `package.json` uses different names, update the commands accordingly.

## API surface

Routes are mounted under `/api/v1` and grouped by resource. See `src/routes/v1` for the exact endpoints and middleware usage. Example groups include:

- `auth` - registration, login, logout, token refresh
- `blog` - create, read (single & all), update, delete blogs
- `comment` - post comments on blogs
- `like` - like and unlike blog posts
- `user` - user CRUD and profile endpoints

For exact route paths & required payloads, open the route files in `src/routes/v1` and their controller implementations in `src/controllers/v1`.

## Tests

There are no tests included by default in the repository. Adding unit/integration tests (Jest, Supertest) is recommended before production deployment.

## Logging & Monitoring

This project includes a logger utility in `src/lib/winston.ts` (or similar). Configure transports and log levels in production as needed.

## Deployment

- Build the project (`npm run build`) and run the compiled JS with `node ./dist/server.js` (or your start script).
- Make sure environment variables are set in your hosting environment.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Run tests and lint (if present)
4. Submit a PR with a clear description of changes

## Assumptions & notes

- I assumed typical npm scripts (`dev`, `build`, `start`) — if your `package.json` differs, update the commands above.
- The README points to `src/config/index.ts` and `src/routes/v1` for authoritative details about env vars and endpoints. Use those files to verify exact names and routes.

Maintainer: Mostafa-khatab

If you'd like, I can:

- Add an example `.env.example` file
- Generate API documentation (OpenAPI / Swagger)
- Add basic Jest tests and a GitHub Actions workflow for CI
