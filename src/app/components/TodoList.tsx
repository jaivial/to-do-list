"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import TodoItem from "./Todo";
import { useTodoContext } from "../context/TodoContext";
import { FiPlus, FiCheckCircle, FiClock } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";
import Calendar from "./Calendar";

// Create a wrapper component that safely uses translations
const TodoListContent = () => {
  const { todos, filteredTodos, dispatch, loading, error, selectedDate } = useTodoContext();
  const { t } = useLanguage();
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter todos by section
  const pendingTodos = (selectedDate ? filteredTodos : todos).filter((todo) => todo.section === "pending" || !todo.completed);
  const completedTodos = (selectedDate ? filteredTodos : todos).filter((todo) => todo.section === "completed" || todo.completed);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside the list or didn't move
    if (!destination) {
      return;
    }

    const sourceDroppableId = source.droppableId;
    const destinationDroppableId = destination.droppableId;

    // Moving within the same section
    if (sourceDroppableId === destinationDroppableId && source.index === destination.index) {
      return;
    }

    const draggedTodo = todos.find((todo) => todo.id === draggableId);
    if (!draggedTodo) return;

    // Optimistic update for UI
    if (sourceDroppableId === destinationDroppableId) {
      // Reordering within the same section
      const sectionTodos = sourceDroppableId === "pending" ? pendingTodos : completedTodos;
      const updatedPositions = Array.from(sectionTodos);
      const [removed] = updatedPositions.splice(source.index, 1);
      updatedPositions.splice(destination.index, 0, removed);

      // Update local state for immediate UI response
      dispatch({
        type: "REORDER_TODO",
        payload: {
          sourceIndex: source.index,
          destinationIndex: destination.index,
        },
      });
    } else {
      // Moving between sections
      const newSection = destinationDroppableId;

      // Update local state for immediate UI response
      dispatch({
        type: "MOVE_TODO_SECTION",
        payload: {
          id: draggableId,
          section: newSection,
        },
      });
    }

    // Then update on the server
    try {
      // If moving between sections, update the todo's section and completed status
      if (sourceDroppableId !== destinationDroppableId) {
        await fetch(`/api/todos/${draggableId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            section: destinationDroppableId,
            completed: destinationDroppableId === "completed",
          }),
        });
      } else {
        // If just reordering, update positions
        const sectionTodos = sourceDroppableId === "pending" ? pendingTodos : completedTodos;
        const updatedPositions = Array.from(sectionTodos);
        const [removed] = updatedPositions.splice(source.index, 1);
        updatedPositions.splice(destination.index, 0, removed);

        await fetch("/api/todos/reorder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            todos: updatedPositions.map((todo, index) => ({
              id: todo.id,
              position: index,
            })),
          }),
        });
      }
    } catch (error) {
      console.error("Error updating todos:", error);
      // If error, refresh todos from server
      try {
        const response = await fetch("/api/todos");
        if (response.ok) {
          const refreshedTodos = await response.json();
          dispatch({
            type: "SET_TODOS",
            payload: refreshedTodos,
          });
        }
      } catch (refreshError) {
        console.error("Error refreshing todos:", refreshError);
      }
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodoTitle.trim()) return;

    try {
      setIsSubmitting(true);

      // Create new todo object for optimistic update
      const optimisticTodo = {
        id: `temp-${Date.now()}`,
        title: newTodoTitle,
        description: newTodoDescription,
        completed: false,
        section: "pending",
        createdAt: selectedDate || new Date(), // Use selected date if available
        updatedAt: new Date(),
        position: pendingTodos.length,
        userId: "",
      };

      // Optimistic update
      dispatch({
        type: "ADD_TODO",
        payload: optimisticTodo,
      });

      // Reset form
      setNewTodoTitle("");
      setNewTodoDescription("");
      setIsAddingTodo(false);

      // Send to server
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTodoTitle,
          description: newTodoDescription,
          section: "pending",
          date: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
        }),
        credentials: "include", // Include credentials for authentication
      });

      if (response.ok) {
        const newTodo = await response.json();
        // Replace optimistic todo with real one
        dispatch({
          type: "DELETE_TODO",
          payload: optimisticTodo.id,
        });
        dispatch({
          type: "ADD_TODO",
          payload: newTodo,
        });
      } else if (response.status === 401) {
        // User is not authenticated
        dispatch({
          type: "DELETE_TODO",
          payload: optimisticTodo.id,
        });
        alert(t("TodoList.authenticationRequired"));
      } else {
        // If error, refresh todos from server
        const refreshResponse = await fetch("/api/todos");
        if (refreshResponse.ok) {
          const refreshedTodos = await refreshResponse.json();
          dispatch({
            type: "SET_TODOS",
            payload: refreshedTodos,
          });
        }
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      // If error, refresh todos from server
      try {
        const response = await fetch("/api/todos");
        if (response.ok) {
          const refreshedTodos = await response.json();
          dispatch({
            type: "SET_TODOS",
            payload: refreshedTodos,
          });
        }
      } catch (refreshError) {
        console.error("Error refreshing todos:", refreshError);
      }
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
      {/* Calendar Component */}
      <Calendar />

      <div className="mb-6">
        {isAddingTodo ? (
          <form onSubmit={handleAddTodo} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="mb-3">
              <input type="text" value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} placeholder={t("TodoList.taskTitle")} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="mb-3">
              <textarea value={newTodoDescription} onChange={(e) => setNewTodoDescription(e.target.value)} placeholder={t("TodoList.taskDescription")} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
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
                {t("TodoList.cancel")}
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center" disabled={isSubmitting || !newTodoTitle.trim()}>
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t("TodoList.adding")}
                  </>
                ) : (
                  <>{t("TodoList.addTask")}</>
                )}
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setIsAddingTodo(true)} className="w-full flex items-center justify-center px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors">
            <FiPlus className="mr-2" />
            {t("TodoList.addNewTask")}
          </button>
        )}
      </div>

      {selectedDate && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-blue-800">
            {t("TodoList.showingTasksFor")} {selectedDate.toLocaleDateString()}
          </p>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded-lg text-blue-800 flex items-start sm:items-center">
          <div className="flex-shrink-0 mt-1 sm:mt-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 min-w-[1.25rem] min-h-[1.25rem]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="ml-2 text-sm sm:text-base">{t("TodoList.dragDropInfo")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pending Tasks Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h2 className="flex items-center text-lg font-medium text-gray-800 mb-4">
              <FiClock className="mr-2 text-blue-500" />
              {t("TodoList.pendingTasks")} ({pendingTodos.length})
            </h2>
            <Droppable droppableId="pending">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 min-h-[200px]">
                  {pendingTodos.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">{t("TodoList.noPendingTasks")}</p>
                    </div>
                  ) : (
                    pendingTodos.map((todo, index) => <TodoItem key={todo.id} todo={todo} index={index} />)
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Completed Tasks Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h2 className="flex items-center text-lg font-medium text-gray-800 mb-4">
              <FiCheckCircle className="mr-2 text-green-500" />
              {t("TodoList.completedTasks")} ({completedTodos.length})
            </h2>
            <Droppable droppableId="completed">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 min-h-[200px]">
                  {completedTodos.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">{t("TodoList.noCompletedTasks")}</p>
                    </div>
                  ) : (
                    completedTodos.map((todo, index) => <TodoItem key={todo.id} todo={todo} index={index} />)
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

// Main component that handles potential errors with translations
const TodoList: React.FC = () => {
  try {
    return <TodoListContent />;
  } catch (error) {
    console.error("Error rendering TodoList with translations:", error);
    // Fallback UI when translations are not available
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mb-4">
          <p>Loading task list...</p>
        </div>
      </div>
    );
  }
};

export default TodoList;
