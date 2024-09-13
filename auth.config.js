export const authConfig = {
  pages: {
    signIn: '/login', // Custom sign-in page
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user; // Check if user is authenticated
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard'); // Check if route is under /dashboard
      
      // If the user is on the dashboard, verify if they're logged in
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to the login page
      }
      // If logged in and not on dashboard, redirect them to the dashboard
      else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      
      return true; // Allow non-dashboard pages to be accessed without login
    },
  },
  providers: [], // Add providers later (we'll update this in future steps)
};
