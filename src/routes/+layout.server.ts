import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";

export const load: LayoutServerLoad = async ({ cookies, url, fetch }) => {
  // Skip authentication check for login and register pages
  if (url.pathname === '/login' || url.pathname === '/register') {
    return {};
  }

  const token = cookies.get('auth-token');

  if (!token) {
    throw redirect(302, '/login');
  }

  // Verify token with external server
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'x-authorization': token,
      },
    });

    if (!response.ok) {
      // Token is invalid, redirect to login
      throw redirect(302, '/login');
    }

    const userData = await response.json();

    return {
      user: userData.user
    };
  } catch (error) {
    // If verification fails, redirect to login
    throw redirect(302, '/login');
  }
};
