import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ cookies }) => {
    // Clear the auth token cookie
    cookies.set('auth-token', '', {
      path: '/',
      expires: new Date(0), // Expire immediately
    });

    // Redirect to login page
    throw redirect(302, '/login');
  },
};
