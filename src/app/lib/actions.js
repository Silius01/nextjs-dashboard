import { signIn } from '@/auth'; // Import the signIn function from the auth.js file
import { AuthError } from 'next-auth';

export async function authenticate(prevState, formData) {
  try {
    // Call the signIn function from NextAuth with the credentials provider
    await signIn('credentials', formData);
  } catch (error) {
    // Handle errors from the authentication process
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'; // Return error message for invalid credentials
        default:
          return 'Something went wrong.'; // Generic error message
      }
    }
    throw error; // Re-throw other unexpected errors
  }
}
