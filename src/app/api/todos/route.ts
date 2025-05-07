import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET all todos for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const todos = await prisma.todo.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        position: 'asc',
      },
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching todos" },
      { status: 500 }
    );
  }
}

// POST a new todo
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description = "", date } = body;

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    // Get the highest position to place the new todo at the end
    const highestPositionTodo = await prisma.todo.findFirst({
      where: { userId: session.user.id },
      orderBy: { position: 'desc' },
    });

    const position = highestPositionTodo ? highestPositionTodo.position + 1 : 0;

    // Parse date if provided, otherwise use current date
    const createdAt = date ? new Date(date) : new Date();

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId: session.user.id,
        position,
        createdAt,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the todo" },
      { status: 500 }
    );
  }
} 