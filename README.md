# nestjs-chat

## Tech Stack

- Next.js
- NestJS
- PostgreSQL

## Prerequisites

- Node.js 22.X
- Docker

## Installation

1. Clone the repository

```bash
git clone https://github.com/ryanmalonzo/nestjs-chat
```

2. Move to the project directory

```bash
cd nestjs-chat
```

3. Run the database

```bash
docker compose up -d
```

4. Install the backend dependencies

```bash
cd api && npm i
```

5. Run the database migrations

```bash
npx prisma migrate dev
```

6. Start the backend server

```bash
npm run start:dev # or npm run dev
```

7. Install the frontend dependencies

```bash
cd ../frontend && npm i
```

8. Start the frontend server

```bash
npm run dev
```

9. Open [http://localhost:5173](http://localhost:5173) in your browser to use the application

## Improvements

- [x] Logout Button
- [x] Usernames
- [x] Avatars
- [x] User Profiles
- [ ] Multiple Channels
- [ ] Dynamic Channel Creation
- [ ] Image Support
- [ ] Emoji Reaction Support
