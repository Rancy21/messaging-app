# relay.

> Real-time messaging, built from scratch with WebSockets.

<div align="center">

![Java](https://img.shields.io/badge/Java_21-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_4-6DB33F?style=flat&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [WebSocket Events](#websocket-events)
- [License](#license)

---

## Overview

**relay.** is a full-stack real-time messaging application that lets users sign up, discover others, and chat one-on-one with instant message delivery, live presence indicators, and typing notifications.

### Why does this exist?

This is a personal project built specifically to **learn and implement WebSocket communication** from the ground up. The goal was to deeply understand the STOMP protocol over WebSockets, real-time event broadcasting, session management, and how to integrate all of it with a Spring Security–protected backend. It's a hands-on exploration of building real-time features

---

## Features

- 💬 **Real-time messaging** — instant message delivery via STOMP over WebSocket
- 🟢 **Live presence** — see who's online in real time
- ✍️ **Typing indicators** — "is typing…" feedback with debounce logic
- 🔐 **JWT authentication** — secure login/register with HTTP-only cookies
- 🔍 **User search** — find and start conversations with any registered user
- 📱 **Responsive UI** — mobile-first design with sidebar toggle
- ⚡ **Optimistic updates** — messages appear instantly before server confirmation

---

## Architecture

```
┌─────────────────┐         WebSocket (STOMP/SockJS)        ┌─────────────────────┐
│                 │◄───────────────────────────────────────►│                     │
│   React SPA     │                                         │  Spring Boot API    │
│   (Vite + TS)   │────── REST (JWT cookie auth) ─────────►│                     │
│                 │                                         │  ┌───────────────┐  │
└─────────────────┘                                         │  │  PostgreSQL   │  │
                                                            │  └───────────────┘  │
                                                            └─────────────────────┘
```

| Layer         | Responsibility                                                     |
| ------------- | ------------------------------------------------------------------ |
| **Frontend**  | React 19 SPA with TanStack Router & Query, STOMP client            |
| **WebSocket** | STOMP over SockJS — chat messages, typing events, presence         |
| **REST API**  | Auth (login/register), conversations, message history, user search |
| **Security**  | JWT in HTTP-only cookies, WebSocket auth via handshake interceptor |
| **Database**  | PostgreSQL with Spring Data JPA (User, Conversation, Message)      |

---

## Tech Stack

### Backend

| Technology               | Purpose                           |
| ------------------------ | --------------------------------- |
| Java 21                  | Language                          |
| Spring Boot 4.0.2        | Framework                         |
| Spring WebSocket + STOMP | Real-time communication           |
| Spring Security          | Authentication & authorization    |
| JJWT 0.12.6              | JWT token generation & validation |
| Spring Data JPA          | ORM / data access                 |
| PostgreSQL               | Relational database               |
| Lombok                   | Boilerplate reduction             |
| Maven                    | Build tool                        |

### Frontend

| Technology      | Purpose                 |
| --------------- | ----------------------- |
| React 19        | UI framework            |
| TypeScript      | Type safety             |
| Vite 7          | Build tool & dev server |
| TailwindCSS 4   | Styling                 |
| TanStack Router | Client-side routing     |
| TanStack Query  | Server state management |
| @stomp/stompjs  | WebSocket STOMP client  |
| SockJS          | WebSocket fallback      |

---

## Getting Started

### Prerequisites

- **Java 21+**
- **Maven 3.9+**
- **Node.js 20+** & **npm**
- **PostgreSQL 15+**

### 1. Clone the repository

```bash
git clone https://github.com/rancy21/messaging-app.git
cd messaging-app
```

### 2. Set up the database

```sql
CREATE DATABASE "chat-app";
```

### 3. Configure environment variables

Create a `.env` file or export the following:

```bash
export JWT_SECRET="your-256-bit-secret-key"
export JWT_EXPIRATION=86400000  # 24 hours in milliseconds
```

Update `backend/src/main/resources/application.yml` with your database credentials if they differ from the defaults.

### 4. Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

The API starts on **http://localhost:8080**.

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app opens at **http://localhost:5173**.

---

## Usage

1. **Register** — create an account at `/register`
2. **Login** — sign in at `/login` (JWT cookie is set automatically)
3. **Start chatting** — click **+** in the sidebar, search for a user, and send a message
4. **See who's online** — green dot = online, gray dot = offline
5. **Typing indicator** — the other user sees "is typing…" as you type

---

## Configuration

### Backend — `application.yml`

| Property                        | Description                             | Default                                     |
| ------------------------------- | --------------------------------------- | ------------------------------------------- |
| `spring.datasource.url`         | PostgreSQL connection URL               | `jdbc:postgresql://localhost:5432/chat-app` |
| `spring.datasource.username`    | DB username                             | —                                           |
| `spring.datasource.password`    | DB password                             | —                                           |
| `jwt.secret`                    | JWT signing key (env: `JWT_SECRET`)     | —                                           |
| `jwt.expiration`                | Token TTL in ms (env: `JWT_EXPIRATION`) | —                                           |
| `spring.jpa.hibernate.ddl-auto` | Schema strategy                         | `update`                                    |

### Frontend

The frontend connects to `http://localhost:8080` by default. To change the API/WebSocket URL, update the base URLs in:

- `frontend/api/client.ts` — REST API base URL
- `frontend/hooks/useStomp.ts` — WebSocket endpoint
- `frontend/hooks/usePresence.ts` — Presence WebSocket endpoint

---

## Project Structure

```
messaging-app/
├── backend/
│   ├── src/main/java/com/larr/message_app/
│   │   ├── controller/
│   │   │   ├── AuthController.java        # Login & register endpoints
│   │   │   ├── ConversationController.java # Conversation CRUD & history
│   │   │   ├── StompController.java        # WebSocket message handlers
│   │   │   └── UserController.java         # User search
│   │   ├── dto/                            # Request/response records
│   │   ├── exception/                      # Custom exceptions
│   │   ├── exceptionHandler/               # STOMP error handler
│   │   ├── listener/
│   │   │   └── StompEventListener.java     # Connect/disconnect & presence
│   │   ├── model/                          # JPA entities (User, Message, Conversation)
│   │   ├── repository/                     # Spring Data repositories
│   │   ├── security/                       # JWT filter, WebSocket auth interceptor
│   │   ├── service/                        # Business logic
│   │   └── WebSocketConfig.java            # STOMP broker configuration
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
│
├── frontend/
│   ├── api/                  # REST API clients (auth, conversations, users)
│   ├── components/ui/        # Reusable UI components (Button, Input, Avatar)
│   ├── context/              # React context (AuthContext)
│   ├── features/
│   │   ├── auth/             # Login & Register pages
│   │   ├── chat/             # ChatPage, ConversationList, MessageThread
│   │   └── presence/         # Presence test page
│   ├── hooks/                # useStomp, usePresence
│   ├── router/               # TanStack Router route definitions
│   ├── types/                # TypeScript interfaces
│   ├── src/                  # App entry point & global styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## API Reference

### Auth

| Method | Endpoint             | Body                     | Description             |
| ------ | -------------------- | ------------------------ | ----------------------- |
| `POST` | `/api/auth/register` | `{ username, password }` | Register a new user     |
| `POST` | `/api/auth/login`    | `{ username, password }` | Login (sets JWT cookie) |

### Conversations

| Method | Endpoint                          | Body                      | Description                  |
| ------ | --------------------------------- | ------------------------- | ---------------------------- |
| `GET`  | `/api/conversations`              | —                         | List user's conversations    |
| `GET`  | `/api/conversations/:id/messages` | —                         | Get message history          |
| `POST` | `/api/conversations/conversation` | `{ username, recipient }` | Get or create a conversation |

### Users

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| `GET`  | `/api/users/:username` | Search users by username |

---

## WebSocket Events

Connect via SockJS at `ws://localhost:8080/message-app-websocket`.

### Destinations (client → server)

| Destination                      | Payload                       | Description                |
| -------------------------------- | ----------------------------- | -------------------------- |
| `/app/chat`                      | `{ conversationId, content }` | Send a chat message        |
| `/app/conversations/{id}/typing` | —                             | Notify that user is typing |

### Subscriptions (server → client)

| Topic                               | Payload                     | Description                               |
| ----------------------------------- | --------------------------- | ----------------------------------------- |
| `/topic/conversations/{id}`         | `MessageDTO` or `ChatEvent` | Incoming messages & typing events         |
| `/topic/presence`                   | `{ userId, status }`        | User online/offline broadcasts            |
| `/user/queue/presence/online-users` | `string[]`                  | Initial list of online users on subscribe |

### Typing Indicator Flow

```
User A types → sendTyping() [throttled 1s]
    → /app/conversations/{id}/typing
    → Server broadcasts ChatEvent { senderUsername, "is_typing" }
    → /topic/conversations/{id}
    → User B receives → shows "is typing…" for 2s
```

---

## License

This project is open source and available under the [MIT License](LICENSE).
