# nestjs-chat

A real-time chat application built with Next.js and NestJS, featuring user authentication, multiple channels, and a modern UI.

![Screenshot](https://raw.githubusercontent.com/ryanmalonzo/nestjs-chat/main/docs/NestRTC.png)

## Features

- User authentication with JWT
- Real-time messaging using WebSockets
- Multiple chat channels
- User profiles with avatars
- Chat bubble color customization

## Tech Stack

- Next.js
- NestJS
- PostgreSQL
- S3 (MinIO)

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

3. Run the Docker containers

```bash
docker compose up -d
```

4. Install the project dependencies

```bash
npm install # or npm i
```

5. Run the database migrations and seed the database

```bash
npm run migrate
```

6. Start the application

```bash
npm start
```

7. Open [http://localhost:5173](http://localhost:5173) in your browser to use the application

## Default User Accounts

After running the database seed script, the following default user accounts are available for testing:

| Email          | Password |
| -------------- | -------- |
| esgi1@myges.fr | esgi1    |
| esgi2@myges.fr | esgi2    |

You can use these credentials to log in and test the chat application.

## Improvements

- [x] Logout Button
- [x] Usernames
- [x] Avatars
- [x] User Profiles
- [x] Multiple Channels
- [ ] Dynamic Channel Creation
- [ ] Image Support
- [ ] Emoji Reaction Support
