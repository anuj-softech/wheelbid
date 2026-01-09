# WheelBid — Car Auctions Platform

**WheelBid** is a modern, full-stack **monorepo** for car auctions.  
It features a **React (Vite)** frontend and a **ConnectRPC (Express)** backend, with **Protobuf-ES v2** as the single source of truth for data contracts.

The repository is organized using **pnpm workspaces**, providing a scalable and type-safe architecture across services.

---

## ✨ Key Highlights

- 📦 Monorepo architecture using **pnpm workspaces**
- 🔄 Type-safe communication with **ConnectRPC**
- 📐 Shared schemas using **Protobuf-ES v2**
- ⚡ Fast frontend powered by **React + Vite**
- 🎨 Modern UI using **Tailwind CSS v4**
- 🚀 Simple and efficient local development workflow

---

## 🛠️ Tech Stack

### Core
- **Package Manager:** pnpm (workspaces)
- **Schema Definition:** Protobuf-ES v2
- **RPC Layer:** ConnectRPC (Protobuf over HTTP/JSON)

### Backend
- Node.js
- Express
- TypeScript

### Frontend
- React
- Vite
- Tailwind CSS v4

---

## 📁 Project Structure

```
wheelbid/
│
├── proto/          # Protobuf schemas (single source of truth)
├── internal/        # ConnectRPC + Express backend
├── web/            # React (Vite) frontend
│
├── package.json    # Root workspace configuration
└── pnpm-workspace.yaml
```

---

## 🚀 Getting Started

### 1️⃣ Install Dependencies

From the repository root:

```bash
pnpm i
```

### 2️⃣ Schema Generation (Important)

```bash
cd proto
buf generate
```

This regenerates TypeScript definitions used by both backend and frontend.

---

## 💻 Development Workflow

### Start Backend

```bash
npm run backend
```
---

### Start Frontend

```bash
npm run frontend
```


## 🧠 Architecture Overview

Proto → Generated Types → Backend (ConnectRPC) → Frontend (React)
