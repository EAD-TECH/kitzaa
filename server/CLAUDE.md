# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a two-folder repo: `client/` and `server/`, each a standalone project with its own `package.json`, `node_modules`, and `tsconfig.json` — always `cd server` before running any command described here. `server/` is a fully-built Express + TypeScript + MongoDB backend; `client/` (Next.js) is at an early scaffold stage. See the repo-root `CLAUDE.md` for the split between the two.

## Commands (run from `server/`)

```
npm install       # install deps
npm run dev       # tsx watch index.ts — dev server with hot reload
npm run build     # tsc -> dist/
npm start         # node dist/index.js (run build first)
npx tsc --noEmit  # type-check only, no build output — use this to verify changes
npm test          # jest, runs tests/**/*.test.ts
npm test -- tests/helpers/slugify.test.ts   # run a single test file
```

### Manual API testing

`server/requests.http` and `server/requests.admin.http` are REST Client (VS Code extension `humao.rest-client`) files with ready-made requests for the user-facing and admin-only APIs respectively, including login flows that capture `@accessToken` for subsequent requests. Prefer extending these over writing ad-hoc curl commands when adding new endpoints.

## Architecture

### Request flow

`index.ts` (loads env, connects DB, starts the HTTP server) → `server.ts` (assembles the Express app: helmet, cors, rate limiting, compression, cookie parsing, `queryHandler`, logging) → `src/routes/index.ts` mounted at `/api/v1` → per-domain route files → controllers → Mongoose models.

Routes are split into **user** (`src/routes/user/`, `src/controllers/user/`) and **admin** (`src/routes/admin/`, `src/controllers/admin/`, mounted under `/admin`, gated by `isAdmin`) with parallel naming (`admin.eventController.ts` mirrors `eventController.ts`). When adding an admin-equivalent of a user feature, follow this existing split rather than branching on role inside one controller.

File uploads go through UploadThing, configured in `src/configs/uploadthing.ts` (defines per-purpose file routes: `profileImage`, `eventImage`, `socialImage`, each with its own auth/ownership middleware and `onUploadComplete` DB write) and mounted directly in `server.ts` at `/api/uploadthing` — **outside** the `/api/v1` prefix.

### Auth & permissions

JWT access/refresh tokens (`src/helpers/generateJwt.ts`). `authentication` middleware (`src/middlewares/authentication.ts`) verifies the access token and attaches the **full Mongoose user document** to `req.user` (typed globally in `src/types/express.d.ts`).

`src/middlewares/permissions.ts` has simple role gates (`isAdmin`, `isOrganizer`, `isOrganizerOrAdmin`) plus a generic `isOwnerOrAdmin(Model, ownerField?)` factory: it fetches the resource by `req.params.id`, checks `ownerField === req.user._id` or admin role, and stashes the already-fetched document on `req.resource` so the controller doesn't re-query. Controllers that use this cast it back: `const event = req.resource as EventDocument`.

### Validation

Zod schemas live in `src/validations/*.schema.ts`, one file per domain. Applied via `validateBody(schema)` (`src/middlewares/validateBody.ts`), which does `schema.safeParse` and replaces `req.body` with the parsed/coerced result. Path params named `id` are validated once per router via `router.param('id', validateObjectIdParam)`. Cross-field rules (e.g. schedule `startDate <= endDate`, `startDate` not in the past) are expressed as `.refine()` on the relevant nested schema, not in the controller.

### Listing / pagination

`queryHandler` middleware (mounted globally in `server.ts`) parses `filter`, `search`, `sort`, `page`, `limit`, `skip` from the query string and attaches two methods to `res` (typed in `src/types/express.d.ts`): `res.getModelList(Model, customFilter?, populate?)` and `res.getModelListDetails(Model, customFilter?)` (returns count + pagination metadata). Every `list`-style endpoint uses this pair instead of calling `Model.find` directly.

### DTO pattern — never return raw Mongoose documents

Every domain has a `toXDTO` helper in `src/helpers/` that maps a hydrated document to a plain response shape. The event domain has two variants in `src/helpers/toEventDTO.ts`:
- `toEventDTO` — public shape, used by user-facing routes.
- `toAdminEventDTO` — adds `rejectedReason`, `cancelledReason`, `approvedAt`, and a fuller `createdBy` (with `role`); used only by admin controllers.

Both resolve `categoryId`/`createdBy` conditionally: if the query `.populate()`d that path (checked via Mongoose's `doc.populated(path)`), it returns a small ref object (`{_id, name, slug, icon}` / `{_id, username, avatarUrl}`); otherwise it returns the raw id string. If a populated ref resolves to `null` (the referenced document was deleted — a dangling ref), it falls back to the original id string instead of throwing. Any new populate-then-serialize code should follow this same populated/unpopulated/dangling-ref handling rather than assuming `.toString()` on a possibly-populated field.

### Event domain specifics

- Status values: `pending | approved | rejected | cancelled | completed`. Admin `approve`/`reject`/`cancel` (`src/controllers/admin/admin.eventController.ts`) each send a themed HTML email (`src/mail/templates/event*.template.ts`) to the event creator, wrapped in `try/catch` so a mail failure never blocks the status update itself. `reject` and `cancel` require `rejectedReason` / `cancelledReason` respectively in the body (`rejectEventSchema` / `cancelEventSchema`).
- `join`/`leave` (`src/controllers/user/eventController.ts`) use a single atomic `findOneAndUpdate` with the capacity/duplicate-participant guards **in the query filter itself** (not a separate read-then-write), so two simultaneous join requests can't both succeed past capacity.
- Public `list`/`read` only ever return `status: 'approved'` events.

### Mail

`src/mail/mail.service.ts` wraps nodemailer (`sendMail({to, subject, html, text?})`). Templates are plain template-literal functions in `src/mail/templates/*.template.ts` returning inline-styled HTML strings — no external templating engine. Follow the existing visual language (green header for positive outcomes, orange/red for rejection/cancellation) when adding new ones. Mail sends in controllers are always wrapped in `try/catch` with a `console.log` fallback — a failed email must never fail the underlying request.

### Error handling

Throw `new CustomError(message, statusCode)` (`src/helpers/customError.ts`) from anywhere in an async route handler. Express 5's native async-error handling forwards the rejection to `errorHandler` (`src/middlewares/errorHandler.ts`, mounted after routes in `index.ts`), which responds with `err.statusCode ?? 500`. A plain `Error` (no `statusCode`) will surface as an unhelpful 500 — always throw `CustomError` for expected failure cases.

### Organizer application flow

`OrganizerApplication` (pending/approved/rejected, with an embedded `statusHistory` audit trail) is the request a `user` submits to become an `organizer`. On admin approval (`admin.organizerApplicationController.ts`) this creates an `Institution` document and elevates the user's `role` — the user must log in again afterward for the new role to take effect in their JWT.

## Required environment variables

`ACCESS_KEY`, `REFRESH_KEY` (JWT signing), `DB_URI` (MongoDB), `CLIENT_URL` (used to build links in emails), `EMAIL_USER`, `EMAIL_PASS`, `MAIL_FROM`, `SMTP_HOST`, `SMTP_PORT` (nodemailer), `UPLOADTHING_TOKEN`, `PORT`, `NODE_ENV`.
