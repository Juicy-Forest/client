import { redirect } from '@sveltejs/kit';

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3030";

export const load = async ({ cookies, url, fetch, depends }) => {
  depends("data:sections")
  // Skip authentication check for login and register pages
  if (url.pathname === '/login' || url.pathname === '/register') {
    return {
    user: null,
    gardenData: [],
    sectionData: [],
    currentGarden: {}
  };
  }

  const token = cookies.get('auth-token');
  if (!token) {
    throw redirect(302, '/login');
  }

  // Verify token with external server
  try {
    const response = await fetch(`${API_BASE_URL}/users/`, {
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
    const gardenRes = await fetch(`${API_BASE_URL}/garden/user`, {
      credentials: "include",
      headers: { 'x-authorization': token }
    });

    const gardenData = await gardenRes.json();
    const parsedGardens = Array.isArray(gardenData) ? gardenData : [];

    // get section data
      const sectionPromises = parsedGardens.map(async (g) => {
      const secRes = await fetch(`${API_BASE_URL}/section/${g._id}`, {
        credentials: "include",
        headers: { 'x-authorization': token }
      });
      return secRes.json();
    });

    const sectionData = await Promise.all(sectionPromises);

    const gardenId = url.searchParams.get('gardenId');
    const currentGarden = parsedGardens.find(g => g._id === gardenId) || parsedGardens[0] || {};

    return {
      userData,
      gardenData: parsedGardens,
      sectionData: sectionData.flat(2),
      currentGarden
    };
  } catch (error) {
    console.log("ERROR:", error)
    // If verification fails, redirect to login
    throw redirect(302, '/login');
  }

};
