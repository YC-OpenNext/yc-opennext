import { Metadata } from 'next';
import { revalidatePath } from 'next/cache';

export const metadata: Metadata = {
  title: 'Server Actions',
  description: 'Server Actions demonstration for form handling',
};

/**
 * Server Actions
 *
 * Server Actions allow you to run server-side code in response to user interactions
 * without creating dedicated API routes. They're particularly useful for forms.
 */

// Server Action for creating a todo
async function createTodo(formData: FormData) {
  'use server';

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  // Simulate database operation
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, you would save to a database here
  console.log('Creating todo:', { title, description });

  // Revalidate the page to show the updated data
  revalidatePath('/server-action');
}

// Server Action for deleting a todo
async function deleteTodo(formData: FormData) {
  'use server';

  const id = formData.get('id') as string;

  // Simulate database operation
  await new Promise((resolve) => setTimeout(resolve, 300));

  console.log('Deleting todo:', id);

  revalidatePath('/server-action');
}

// Server Action with validation
async function submitFeedback(formData: FormData) {
  'use server';

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // Validation
  if (!name || name.length < 2) {
    console.error('Validation error: Name must be at least 2 characters long');
    return;
  }

  if (!email || !email.includes('@')) {
    console.error('Validation error: Please provide a valid email address');
    return;
  }

  if (!message || message.length < 10) {
    console.error('Validation error: Message must be at least 10 characters long');
    return;
  }

  // Simulate sending email or saving to database
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Feedback submitted:', { name, email, message });
}

async function getTodos() {
  // Simulate fetching from database
  await new Promise((resolve) => setTimeout(resolve, 100));

  return [
    {
      id: '1',
      title: 'Test Server Actions',
      description: 'Make sure they work correctly',
      completed: true,
    },
    {
      id: '2',
      title: 'Deploy to Yandex Cloud',
      description: 'Use YC-OpenNext for deployment',
      completed: false,
    },
    {
      id: '3',
      title: 'Monitor Performance',
      description: 'Check logs and metrics',
      completed: false,
    },
  ];
}

export default async function ServerActionPage() {
  const todos = await getTodos();

  return (
    <div className="page-container">
      <div className="section">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span className="badge">Server Actions</span>
          <span className="badge success">Forms</span>
        </div>
        <h1 className="page-title">Server Actions</h1>
        <p className="page-description">
          Demonstrating server-side form handling without API routes
        </p>
      </div>

      <div className="section">
        <div className="card">
          <h3 className="card-title">What are Server Actions?</h3>
          <p className="card-description">
            Server Actions are asynchronous functions that run on the server. They can be called
            from Client or Server Components to handle form submissions and data mutations.
          </p>
          <ul style={{ marginTop: '1rem', marginLeft: '1.5rem' }}>
            <li>No need to create separate API routes</li>
            <li>Automatic CSRF protection</li>
            <li>Progressive enhancement (works without JavaScript)</li>
            <li>Integrated with React's form actions</li>
            <li>Type-safe with TypeScript</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Create Todo</h2>
        <div className="card">
          <form action={createTodo}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                placeholder="Enter todo title"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <input
                id="description"
                name="description"
                type="text"
                className="form-input"
                placeholder="Enter todo description"
                required
              />
            </div>

            <button type="submit" className="button">
              Create Todo
            </button>
          </form>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Current Todos</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {todos.map((todo) => (
            <div key={todo.id} className="card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>
                    {todo.title}
                    {todo.completed && (
                      <span className="badge success" style={{ marginLeft: '0.5rem' }}>
                        Completed
                      </span>
                    )}
                  </h3>
                  <p className="card-description">{todo.description}</p>
                </div>
                <form action={deleteTodo} style={{ margin: 0 }}>
                  <input type="hidden" name="id" value={todo.id} />
                  <button
                    type="submit"
                    className="button"
                    style={{
                      backgroundColor: '#dc2626',
                      fontSize: '0.875rem',
                      padding: '0.5rem 1rem',
                    }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Feedback Form</h2>
        <div className="card">
          <p className="card-description">
            This form demonstrates server-side validation with Server Actions
          </p>
          <form action={submitFeedback}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Name (min 2 characters)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">
                Message (min 10 characters)
              </label>
              <textarea
                id="message"
                name="message"
                className="form-input"
                rows={4}
                placeholder="Your feedback..."
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="button">
              Submit Feedback
            </button>
          </form>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h3 className="card-title">Benefits of Server Actions</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Security</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Built-in CSRF protection and secure by default
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Performance</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                No extra API route overhead, direct server execution
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Developer Experience</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Simpler code, less boilerplate, better TypeScript support
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Progressive Enhancement
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Forms work without JavaScript, enhanced when available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <a href="/" className="button">
          Back to Home
        </a>
      </div>
    </div>
  );
}
