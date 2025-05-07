"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { TodoProvider } from "../context/TodoContext";
import TodoList from "../components/TodoList";
import { FiLogOut } from "react-icons/fi";

const Dashboard: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">My Tasks</h1>
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">Hello, {user.name}</span>
            <button onClick={logout} className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TodoProvider>
          <TodoList />
        </TodoProvider>
      </main>
    </div>
  );
};

export default Dashboard;
