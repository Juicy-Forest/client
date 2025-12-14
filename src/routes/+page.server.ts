import { redirect } from '@sveltejs/kit';

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3030";

export const load = async ({ cookies, url, fetch }) => {
  // Skip authentication check for login and register pages
  if (url.pathname === '/login' || url.pathname === '/register') {
     return {
    user: null,
    gardenData: [],
    sectionData: []
  };
  }

  const token = cookies.get('auth-token');
  if (!token) {
    throw redirect(302, '/login');
  }

  // Verify token with external server
  try {
    const response = await fetch(`${API_BASE_URL}/user/`, {
      method: 'GET',
      credentials: "include",
      headers: {
        'x-authorization': token,
      },
    });

    if (!response.ok) {
      // Token is invalid, redirect to login
      throw redirect(302, '/login');
    }

    const userData = await response.json();
    
    // Get garden data
    const gardenResponse = await fetch(`${API_BASE_URL}/garden/user`, {
      credentials: "include",
      headers: {
        'x-authorization': token,
      },
    })
    const parsedGardens = await gardenResponse.json()
    // get section data
    const sectionResponsePromises = parsedGardens.map(async (garden) => {
      const response = await fetch(`${API_BASE_URL}/section/${garden._id}`, {
        credentials: "include",
        headers: {
        'x-authorization': token,
      },
      })
      const parsed = await response.json()
      return parsed
    })

    const resolvedSectionPromises = await Promise.all(sectionResponsePromises)
    // Get section data, get grid data
    return {
      user: userData,
      gardenData: parsedGardens,
      sectionData: resolvedSectionPromises
    };
  } catch (error) {
    console.log("ERROR:", error)
    // If verification fails, redirect to login
    throw redirect(302, '/login');
  }

};
