# Todo List Application

A full-stack Todo List application built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL. Features include user authentication, drag-and-drop task reordering, and a responsive design.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete tasks
- Drag-and-drop reordering of tasks
- Responsive design for all screen sizes (down to 240px width)
- Real-time UI updates
- PostgreSQL database for data persistence

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: React Context API with useReducer
- **Drag and Drop**: @hello-pangea/dnd

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/todoapp"
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. Set up the database:
   ```bash
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/src
  /app
    /api
      /auth
        /nextauth
          route.ts
        /register
          route.ts
      /todos
        /[id]
          route.ts
        /reorder
          route.ts
        route.ts
    /auth
      /login
        page.tsx
      /register
        page.tsx
    /components
      /ui
        Button.tsx
        Input.tsx
      Todo.tsx
      TodoList.tsx
    /context
      AuthContext.tsx
      TodoContext.tsx
    /dashboard
      page.tsx
    /lib
      next-auth.d.ts
      types.ts
    /providers
      NextAuthProvider.tsx
    globals.css
    layout.tsx
    page.tsx
/prisma
  schema.prisma
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Prisma Documentation](https://www.prisma.io/docs) - learn about Prisma ORM.
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction) - learn about NextAuth.js.
