"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import TodoItem from "./Todo";
import { useTodoContext } from "../context/TodoContext";
import { FiPlus } from "react-icons/fi";

const TodoList: React.FC = () => {
  const { todos, dispatch, loading, error } = useTodoContext();
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    // If dropped outside the list or didn't move
    if (!destination || destination.index === source.index) {
      return;
    }

    // Reorder the todos locally first for immediate UI update
    dispatch({
      type: "REORDER_TODO",
      payload: {
        sourceIndex: source.index,
        destinationIndex: destination.index,
      },
    });

    // Then update on the server
    try {
      await fetch("/api/todos/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todos: todos.map((todo, index) => ({
            id: todo.id,
            position: index,
          })),
        }),
      });
    } catch (error) {
      console.error("Error reordering todos:", error);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodoTitle.trim()) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTodoTitle,
          description: newTodoDescription,
        }),
      });

      if (response.ok) {
        const newTodo = await response.json();
        dispatch({
          type: "ADD_TODO",
          payload: newTodo,
        });
        setNewTodoTitle("");
        setNewTodoDescription("");
        setIsAddingTodo(false);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6">
        {isAddingTodo ? (
          <form onSubmit={handleAddTodo} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="mb-3">
              <input type="text" value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} placeholder="Task title" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="mb-3">
              <textarea value={newTodoDescription} onChange={(e) => setNewTodoDescription(e.target.value)} placeholder="Task description (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingTodo(false);
                  setNewTodoTitle("");
                  setNewTodoDescription("");
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center" disabled={isSubmitting || !newTodoTitle.trim()}>
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>Add Task</>
                )}
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setIsAddingTodo(true)} className="w-full flex items-center justify-center px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors">
            <FiPlus className="mr-2" />
            Add New Task
          </button>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {todos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No tasks yet. Add one to get started!</p>
                </div>
              ) : (
                todos.map((todo, index) => <TodoItem key={todo.id} todo={todo} index={index} />)
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoList;
