import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-use-form-state'; // Custom hook for form state handling
import { authenticate } from '../lib/actions'; // Import the authenticate action

export default function LoginForm() {
  const [formState, { text, password }] = useFormState(); // Hook for managing form state
  const { pending, error } = useFormStatus(); // Hook for handling pending and error states
  const [errorMessage, setErrorMessage] = useState(''); // Local state for error message

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Clear any previous error messages

    // Extract form data
    const formData = {
      email: formState.values.email,
      password: formState.values.password,
    };

    // Call the authenticate action
    const error = await authenticate(null, formData);

    // Handle error, if any
    if (error) {
      setErrorMessage(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      <div>
        <label htmlFor="email">Email</label>
        <input
          {...text('email')}
          id="email"
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          {...password('password')}
          id="password"
          type="password"
          required
          className="border p-2 w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-full"
        disabled={pending} // Disable the button when form is pending
      >
        {pending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
