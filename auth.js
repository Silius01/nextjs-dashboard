import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

// Function to get the user from the database by email
async function getUser(email) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0]; // Return the first result from the query
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

// Export authentication configuration, sign-in, and sign-out methods
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    // Define the credentials provider
    Credentials({
      async authorize(credentials) {
        // Use zod for input validation
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // Fetch user from the database
          const user = await getUser(email);
          if (!user) return null; // Return null if the user is not found

          // Compare the input password with the hashed password in the database
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            return user; // Return the user object if passwords match
          }
        }

        // Log invalid credentials attempt and return null
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
