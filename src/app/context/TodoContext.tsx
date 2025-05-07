"use client";

import React, { createContext, useContext, useReducer, useEffect, useState, useMemo } from "react";
import { Todo, TodoAction, TodoContextType } from "../lib/types";
import { useSession } from "next-auth/react";

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, action.payload];
    case "UPDATE_TODO":
      return state.map((todo) => (todo.id === action.payload.id ? action.payload : todo));
    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    case "COMPLETE_TODO":
      return state.map((todo) =>
        todo.id === action.payload
          ? {
              ...todo,
              completed: !todo.completed,
              section: todo.completed ? "pending" : "completed",
            }
          : todo
      );
    case "MOVE_TODO_SECTION":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? {
              ...todo,
              section: action.payload.section,
              completed: action.payload.section === "completed",
            }
          : todo
      );
    case "REORDER_TODO": {
      const { sourceIndex, destinationIndex, sourceSection, destinationSection } = action.payload;

      // If moving between sections
      if (sourceSection && destinationSection && sourceSection !== destinationSection) {
        const result = Array.from(state);
        const sourceItem = result.find((todo, idx) => todo.section === sourceSection && idx === sourceIndex);

        if (!sourceItem) return state;

        // Remove the item from its original position
        const newState = state.filter((todo) => todo.id !== sourceItem.id);

        // Update the item with new section and completed status
        const updatedItem = {
          ...sourceItem,
          section: destinationSection,
          completed: destinationSection === "completed",
        };

        // Insert at the new position
        const destinationSectionItems = newState.filter((todo) => todo.section === destinationSection);
        const beforeDestination = newState.filter((todo) => todo.section !== destinationSection && (todo.section < destinationSection || (todo.section === destinationSection && todo.position < destinationIndex)));
        const afterDestination = newState.filter((todo) => todo.section !== destinationSection && (todo.section > destinationSection || (todo.section === destinationSection && todo.position >= destinationIndex)));

        // Combine all items
        return [...beforeDestination, ...destinationSectionItems.slice(0, destinationIndex), updatedItem, ...destinationSectionItems.slice(destinationIndex), ...afterDestination].map((todo, index) => ({
          ...todo,
          position: index,
        }));
      }
      // Regular reordering within the same section
      else {
        const result = Array.from(state);
        const [removed] = result.splice(sourceIndex, 1);
        result.splice(destinationIndex, 0, removed);

        // Update positions
        return result.map((todo, index) => ({
          ...todo,
          position: index,
        }));
      }
    }
    case "SET_TODOS":
      return action.payload;
    case "SET_SELECTED_DATE":
      // This doesn't affect the todos array, just the selected date
      return state;
    default:
      return state;
  }
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { status } = useSession();

  useEffect(() => {
    let isMounted = true;

    const fetchTodos = async () => {
      // Si no hay una sesión activa o montado, no hacemos nada
      if (status !== "authenticated" || !isMounted) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/todos");

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        // Solo actualizamos el estado si el componente sigue montado
        if (isMounted) {
          const data = await response.json();
          dispatch({ type: "SET_TODOS", payload: data });
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Si el estado cambia a "unauthenticated", limpiamos los todos
    if (status === "unauthenticated" && isMounted) {
      dispatch({ type: "SET_TODOS", payload: [] });
      setLoading(false);
    } else {
      fetchTodos();
    }

    return () => {
      isMounted = false;
    };
  }, [status]);

  // Handle selected date change
  const handleSetSelectedDate = (date: Date | null) => {
    setSelectedDate(date);
    dispatch({ type: "SET_SELECTED_DATE", payload: date });
  };

  // Filter todos based on selected date
  const filteredTodos = useMemo(() => {
    if (!selectedDate) return todos;

    return todos.filter((todo) => {
      const todoDate = new Date(todo.createdAt);

      // Normalize dates to compare only year, month, and day
      return todoDate.getFullYear() === selectedDate.getFullYear() && todoDate.getMonth() === selectedDate.getMonth() && todoDate.getDate() === selectedDate.getDate();
    });
  }, [todos, selectedDate]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        dispatch,
        loading,
        error,
        selectedDate,
        setSelectedDate: handleSetSelectedDate,
        filteredTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
