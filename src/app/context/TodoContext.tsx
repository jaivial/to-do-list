"use client";

import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { Todo, TodoAction, TodoContextType } from "../lib/types";

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
      return state.map((todo) => (todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo));
    case "REORDER_TODO": {
      const { sourceIndex, destinationIndex } = action.payload;
      const result = Array.from(state);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);

      // Update positions
      return result.map((todo, index) => ({
        ...todo,
        position: index,
      }));
    }
    case "SET_TODOS":
      return action.payload;
    default:
      return state;
  }
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/todos");

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await response.json();
        dispatch({ type: "SET_TODOS", payload: data });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return <TodoContext.Provider value={{ todos, dispatch, loading, error }}>{children}</TodoContext.Provider>;
};

export const useTodoContext = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
