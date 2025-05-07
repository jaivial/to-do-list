import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

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
    const { todos } = body;

    if (!todos || !Array.isArray(todos)) {
      return NextResponse.json(
        { message: "Invalid request format. Expected array of todos." },
        { status: 400 }
      );
    }

    // Update all todos with their new positions
    const updatePromises = todos.map((todo, index) => {
      return prisma.todo.update({
        where: {
          id: todo.id,
          userId: session.user.id, // Ensure the todo belongs to the user
        },
        data: {
          position: index,
        },
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json(
      { message: "Todos reordered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error reordering todos:", error);
    return NextResponse.json(
      { message: "An error occurred while reordering todos" },
      { status: 500 }
    );
  }
} 