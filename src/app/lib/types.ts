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
  section: string;
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
  | { type: 'MOVE_TODO_SECTION'; payload: { id: string; section: string } }
  | { type: 'REORDER_TODO'; payload: { sourceIndex: number; destinationIndex: number; sourceSection?: string; destinationSection?: string } }
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'SET_SELECTED_DATE'; payload: Date | null };

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  hasTasks: boolean;
  hasPendingTasks: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export interface TodoContextType {
  todos: Todo[];
  dispatch: React.Dispatch<TodoAction>;
  loading: boolean;
  error: string | null;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  filteredTodos: Todo[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
} 