export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  position: number;
  userId: string;
}

export type TodoAction =
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'COMPLETE_TODO'; payload: string }
  | { type: 'REORDER_TODO'; payload: { sourceIndex: number; destinationIndex: number } }
  | { type: 'SET_TODOS'; payload: Todo[] };

export interface TodoContextType {
  todos: Todo[];
  dispatch: React.Dispatch<TodoAction>;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
} 