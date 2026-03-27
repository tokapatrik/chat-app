# Chat App (Monorepo) 💬

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--time-010101?logo=socket.io)](https://socket.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Monorepo](https://img.shields.io/badge/Monorepo-Turborepo-EF4444)](https://turbo.build/repo)

A production-minded real-time chat starter built with TypeScript.

It includes room-based messaging, WebSocket events, and cursor-paginated message history with infinite scroll.

> [!TIP]
> Best for developers who want a practical full-stack chat reference with clean room flows and real-time updates.

## Why this repo ✨

- ⚡ Real-time chat with Socket.IO (`join`, `leave`, `message` events)
- 🧩 Room-based conversations (create/list/update/delete rooms)
- 🕘 Cursor pagination for older message history
- ♾️ Infinite-scroll chat UI
- 🏗️ Full-stack TypeScript monorepo with Turborepo + pnpm

## Tech Stack 🛠️

- Frontend: TanStack Start (React 19), TanStack Router, TanStack Query, Vite, Tailwind CSS
- Backend: NestJS, Socket.IO, TypeORM
- Database: PostgreSQL (via Docker Compose)
- Tooling: Turborepo, pnpm workspaces, ESLint, Prettier

## Project Structure 🗂️

```text
apps/
	backend/    NestJS API + WebSocket gateway
	frontend/   React client app
packages/
	eslint-config/
	typescript-config/
```

## Quickstart (5 minutes) 🚀

> [!NOTE]
> Prerequisites: Node 18+, pnpm 9+, Docker

### 1) Install dependencies

```bash
pnpm install
```

### 2) Start PostgreSQL

```bash
docker compose up -d
```

### 3) Configure environment files

Backend:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Frontend:

```bash
cp apps/frontend/.env.example apps/frontend/.env
```

## Available Scripts 📜

From the repo root:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm check-types
pnpm format:fix
```

## API and Real-time Overview 🔌

### Request flow 🔄

1. Frontend calls REST API for room list and paginated message history.
2. Frontend joins a room over WebSocket.
3. New messages are broadcast in real time and merged into the latest query cache page.

### Socket events 📡

- Client -> server: `join`, `leave`, `message`
- Server -> client: `message`

## Environment Variables 🔐

Backend (`apps/backend/.env`):

- `PORT` (default: `3000`)
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`

Frontend (`apps/frontend/.env`):

- `VITE_API_BASE_URL` (example: `http://localhost:3000`)

## Contributing 🤝

Contributions are welcome.

If you want to help, open an issue with:

1. Problem statement
2. Expected behavior
3. Repro steps or proposal

Then submit a focused pull request linked to that issue.

## License 📄

No project license has been selected yet.
Consider adding a license file before broader public distribution.
