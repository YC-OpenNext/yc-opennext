'use server';

import { revalidatePath } from 'next/cache';

// Type definitions for our actions
export type FormState = {
  message: string;
  success: boolean;
  timestamp?: number;
} | null;

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

// In-memory storage (in production, use a database)
const todos: Todo[] = [
  { id: '1', text: 'Learn Next.js 15', completed: false, createdAt: Date.now() - 3600000 },
  { id: '2', text: 'Try Server Actions', completed: false, createdAt: Date.now() - 1800000 },
  { id: '3', text: 'Build with Turbopack', completed: false, createdAt: Date.now() },
];

/**
 * Submit contact form - demonstrates server action with useActionState
 */
export async function submitContactForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // Validation
  if (!name || name.length < 2) {
    return {
      message: 'Name must be at least 2 characters long',
      success: false,
      timestamp: Date.now(),
    };
  }

  if (!email || !email.includes('@')) {
    return {
      message: 'Please enter a valid email address',
      success: false,
      timestamp: Date.now(),
    };
  }

  if (!message || message.length < 10) {
    return {
      message: 'Message must be at least 10 characters long',
      success: false,
      timestamp: Date.now(),
    };
  }

  // Simulate processing
  console.log('Contact form submitted:', { name, email, message });

  return {
    message: `Thank you, ${name}! Your message has been received.`,
    success: true,
    timestamp: Date.now(),
  };
}

/**
 * Get all todos - server action that returns data
 */
export async function getTodos(): Promise<Todo[]> {
  // Simulate database query
  await new Promise((resolve) => setTimeout(resolve, 300));
  return todos.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Add a new todo - demonstrates optimistic updates
 */
export async function addTodo(text: string): Promise<Todo> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Validation
  if (!text || text.trim().length === 0) {
    throw new Error('Todo text cannot be empty');
  }

  const newTodo: Todo = {
    id: String(Date.now()),
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
  };

  todos.push(newTodo);

  // Revalidate the page to show updated data
  revalidatePath('/optimistic');

  return newTodo;
}

/**
 * Toggle todo completion status
 */
export async function toggleTodo(id: string): Promise<Todo> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    throw new Error('Todo not found');
  }

  todo.completed = !todo.completed;

  // Revalidate the page
  revalidatePath('/optimistic');

  return todo;
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: string): Promise<{ id: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error('Todo not found');
  }

  todos.splice(index, 1);

  // Revalidate the page
  revalidatePath('/optimistic');

  return { id };
}

/**
 * Server-only computation - demonstrates expensive operations on server
 */
export async function performServerComputation(input: number): Promise<{
  input: number;
  result: number;
  computeTime: number;
}> {
  const startTime = Date.now();

  // Simulate expensive computation
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Fibonacci-like computation
  let result = input;
  for (let i = 0; i < 1000000; i++) {
    result = (result * 1.0001) % 1000000;
  }

  const computeTime = Date.now() - startTime;

  return {
    input,
    result: Math.round(result),
    computeTime,
  };
}

/**
 * Streaming server action - demonstrates progressive data loading
 */
export async function getStreamingData(): Promise<string[]> {
  const data: string[] = [];

  // Simulate streaming data
  for (let i = 1; i <= 5; i++) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    data.push(`Data chunk ${i} loaded at ${new Date().toLocaleTimeString()}`);
  }

  return data;
}
