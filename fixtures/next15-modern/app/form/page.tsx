'use client';

import { useActionState } from 'react';
import { submitContactForm, type FormState } from '../actions';

const initialState: FormState = null;

export default function FormPage() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  return (
    <div>
      <div className="card">
        <h2>
          Contact Form with useActionState
          <span className="badge new">React 19</span>
        </h2>
        <p>
          This form demonstrates React 19&apos;s useActionState hook, which replaces the previous
          useFormState. It provides better integration with server actions and automatic pending
          states.
        </p>
      </div>

      <div className="card">
        <h3>Features Demonstrated:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '1.8' }}>
          <li>
            <strong>Progressive Enhancement:</strong> Works without JavaScript
          </li>
          <li>
            <strong>Server-Side Validation:</strong> Validation happens on the server
          </li>
          <li>
            <strong>Automatic Pending States:</strong> isPending from useActionState
          </li>
          <li>
            <strong>Error Handling:</strong> Server errors are returned in state
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support
          </li>
        </ul>
      </div>

      <div className="card">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <form action={formAction as any}>
          {state?.message && (
            <div className={state.success ? 'success' : 'error'}>{state.message}</div>
          )}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              required
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your.email@example.com"
              required
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Enter your message (at least 10 characters)"
              required
              disabled={isPending}
            />
          </div>

          <button type="submit" className="button" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit Form'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>How It Works:</h3>
        <div className="code">
          {`'use client';

import { useActionState } from 'react';
import { submitContactForm } from '../actions';

export default function FormPage() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    null
  );

  return (
    <form action={formAction}>
      {/* Form fields */}
      <button disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}`}
        </div>
      </div>
    </div>
  );
}
