import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

const prisma = new PrismaClient();

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// GET a specific todo
export async function GET(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo) {
      return NextResponse.json(
        { message: "Todo not found" },
        { status: 404 }
      );
    }

    // Check if the todo belongs to the current user
    if (todo.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the todo" },
      { status: 500 }
    );
  }
}

// PATCH to update a todo
export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Check if the todo exists and belongs to the user
    const existingTodo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!existingTodo) {
      return NextResponse.json(
        { message: "Todo not found" },
        { status: 404 }
      );
    }

    if (existingTodo.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, completed, position, section } = body;

    // Ensure section is consistent with completed status
    let sectionValue = section;
    if (completed !== undefined) {
      sectionValue = completed ? "completed" : "pending";
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        ...(position !== undefined && { position }),
        ...(sectionValue !== undefined && { section: sectionValue }),
      },
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the todo" },
      { status: 500 }
    );
  }
}

// DELETE a todo
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Check if the todo exists and belongs to the user
    const existingTodo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!existingTodo) {
      return NextResponse.json(
        { message: "Todo not found" },
        { status: 404 }
      );
    }

    if (existingTodo.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.todo.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the todo" },
      { status: 500 }
    );
  }
} 