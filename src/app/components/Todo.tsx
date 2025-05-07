"use client";

import React, { useState } from "react";
import { Todo } from "../lib/types";
import { useTodoContext } from "../context/TodoContext";
import { FiTrash2, FiEdit, FiCheck, FiX } from "react-icons/fi";
import { Draggable } from "@hello-pangea/dnd";
import { useLanguage } from "../context/LanguageContext";

interface TodoItemProps {
  todo: Todo;
  index: number;
}

// Create a wrapper component that safely uses translations
const TodoItemContent: React.FC<TodoItemProps> = ({ todo, index }) => {
  const { dispatch } = useTodoContext();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");

  const handleComplete = async () => {
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        dispatch({
          type: "UPDATE_TODO",
          payload: updatedTodo,
        });
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch({
          type: "DELETE_TODO",
          payload: todo.id,
        });
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        dispatch({
          type: "UPDATE_TODO",
          payload: updatedTodo,
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleCancel = () => {
    setTitle(todo.title);
    setDescription(todo.description || "");
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white border rounded-lg shadow-sm p-4 mb-3 transition-all
            ${todo.completed ? "opacity-75 border-green-300 bg-green-50" : "border-gray-200"}
            hover:shadow-md
          `}
        >
          {isEditing ? (
            <div className="space-y-3">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={t("TodoList.taskTitle")} />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={t("TodoList.taskDescription")} rows={2} />
              <div className="flex justify-end space-x-2">
                <button onClick={handleCancel} className="flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  <FiX className="mr-1" />
                  {t("Todo.cancel")}
                </button>
                <button onClick={handleSave} className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <FiCheck className="mr-1" />
                  {t("Todo.save")}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <input type="checkbox" checked={todo.completed} onChange={handleComplete} className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500" />
                  <h3 className={`ml-3 text-lg font-medium ${todo.completed ? "line-through text-gray-500" : "text-gray-900"}`}>{todo.title}</h3>
                </div>
                <div className="flex space-x-1">
                  <button onClick={handleEdit} className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100">
                    <FiEdit size={16} />
                  </button>
                  <button onClick={handleDelete} className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              {todo.description && <p className={`mt-2 text-sm ${todo.completed ? "text-gray-400" : "text-gray-600"}`}>{todo.description}</p>}
              <div className="mt-2 text-xs text-gray-400">{new Date(todo.updatedAt).toLocaleDateString()}</div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

// Main component that handles potential errors with translations
const TodoItem: React.FC<TodoItemProps> = (props) => {
  try {
    return <TodoItemContent {...props} />;
  } catch (error) {
    console.error("Error rendering TodoItem with translations:", error);
    // Fallback UI when translations are not available
    return (
      <Draggable draggableId={props.todo.id} index={props.index}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-3">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-medium">{props.todo.title}</h3>
            </div>
            {props.todo.description && <p className="mt-2 text-sm text-gray-600">{props.todo.description}</p>}
          </div>
        )}
      </Draggable>
    );
  }
};

export default TodoItem;
