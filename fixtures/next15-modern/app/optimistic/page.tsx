'use client';

import { useOptimistic, useState, useTransition, useEffect } from 'react';
import { getTodos, addTodo, toggleTodo, deleteTodo, type Todo } from '../actions';

export default function OptimisticPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state: Todo[], newTodo: Todo) => [...state, newTodo],
  );
  const [isPending, startTransition] = useTransition();
  const [newTodoText, setNewTodoText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load initial todos
  useEffect(() => {
    getTodos().then(setTodos);
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodoText.trim()) {
      setError('Please enter a todo');
      return;
    }

    setError(null);

    // Create optimistic todo
    const optimisticTodo: Todo = {
      id: `temp-${Date.now()}`,
      text: newTodoText,
      completed: false,
      createdAt: Date.now(),
    };

    // Optimistically add the todo
    addOptimisticTodo(optimisticTodo);
    setNewTodoText('');

    // Actually add to server
    startTransition(async () => {
      try {
        const newTodo = await addTodo(newTodoText);
        setTodos((prev) => [...prev, newTodo]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add todo');
        // Revert optimistic update by refetching
        const freshTodos = await getTodos();
        setTodos(freshTodos);
      }
    });
  };

  const handleToggleTodo = (id: string) => {
    startTransition(async () => {
      // Optimistically update
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
      );

      try {
        await toggleTodo(id);
      } catch (err) {
        setError('Failed to toggle todo');
        // Revert by refetching
        const freshTodos = await getTodos();
        setTodos(freshTodos);
      }
    });
  };

  const handleDeleteTodo = (id: string) => {
    startTransition(async () => {
      // Optimistically remove
      setTodos((prev) => prev.filter((todo) => todo.id !== id));

      try {
        await deleteTodo(id);
      } catch (err) {
        setError('Failed to delete todo');
        // Revert by refetching
        const freshTodos = await getTodos();
        setTodos(freshTodos);
      }
    });
  };

  return (
    <div>
      <div className="card">
        <h2>
          Optimistic UI Updates
          <span className="badge new">React 19</span>
        </h2>
        <p>
          This demo uses React 19&apos;s useOptimistic hook to provide instant UI feedback while
          server actions are being processed. The UI updates immediately, then reconciles with the
          server response.
        </p>
      </div>

      <div className="card">
        <h3>Try It Out:</h3>
        <p>
          Add, toggle, or delete todos and notice how the UI updates instantly even though each
          action takes 500-800ms on the server. This provides a much better user experience.
        </p>

        <form onSubmit={handleAddTodo} style={{ marginBottom: '1.5rem' }}>
          {error && <div className="error">{error}</div>}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Enter a new todo..."
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ced4da',
              }}
              disabled={isPending}
            />
            <button type="submit" className="button" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add Todo'}
            </button>
          </div>
        </form>

        <div>
          {optimisticTodos.length === 0 ? (
            <p style={{ color: '#6c757d', textAlign: 'center', padding: '2rem' }}>
              No todos yet. Add one above!
            </p>
          ) : (
            optimisticTodos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''} ${
                  todo.id.startsWith('temp-') ? 'optimistic' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span style={{ flex: 1 }}>{todo.text}</span>
                {todo.id.startsWith('temp-') && (
                  <span className="badge" style={{ background: '#ffc107', color: '#000' }}>
                    Pending...
                  </span>
                )}
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="button button-secondary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <h3>How It Works:</h3>
        <div className="code">
          {`'use client';

import { useOptimistic, useTransition } from 'react';
import { addTodo, type Todo } from '../actions';

export default function OptimisticPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  );
  const [isPending, startTransition] = useTransition();

  const handleAddTodo = async (text: string) => {
    // Optimistically add
    const optimisticTodo = {
      id: 'temp-' + Date.now(),
      text,
      completed: false
    };
    addOptimisticTodo(optimisticTodo);

    // Actually add to server
    startTransition(async () => {
      const newTodo = await addTodo(text);
      setTodos(prev => [...prev, newTodo]);
    });
  };
}`}
        </div>
      </div>

      <div className="card">
        <h3>Key Benefits:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '1.8' }}>
          <li>
            <strong>Instant Feedback:</strong> UI updates immediately without waiting for server
          </li>
          <li>
            <strong>Better UX:</strong> No loading spinners for every action
          </li>
          <li>
            <strong>Automatic Reconciliation:</strong> React handles syncing with server state
          </li>
          <li>
            <strong>Error Recovery:</strong> Can revert optimistic updates on failure
          </li>
          <li>
            <strong>Type Safe:</strong> Full TypeScript support with proper typing
          </li>
        </ul>
      </div>
    </div>
  );
}
