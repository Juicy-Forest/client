import { fail, redirect, type Actions } from "@sveltejs/kit";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3030";

export const actions: Actions = {
  changePassword: async ({ request, cookies, fetch }) => {
    const data = await request.formData();
    const newPassword = data.get("newPassword") as string;
    const token = cookies.get('auth-token');
    
    if (!token) {
      return fail(401, { error: "Not authenticated" });
    }

    if (!newPassword) {
      return fail(400, { error: "'New password' field is required" });
    }

    if (newPassword.length < 8) {
      return fail(400, { error: "Password must be at least 8 characters long" });
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/changePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-authorization': token,
        },
        body: JSON.stringify({ newPassword }),
      });
      
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error("API returned non-JSON response:", text);
        return fail(500, { error: "Server error: Invalid response format" });
      }
      
      if (!response.ok) {
        return fail(response.status, { error: result.error || "Password change failed" });
      }
      
      return { success: true, message: "Password changed successfully!" };
    } catch (error) {
      console.error("Password change error:", error);
      return fail(500, { error: "Internal server error" });
    }
  },

  logout: async ({ cookies }) => {
    cookies.delete('auth-token', { path: '/' });
    throw redirect(303, '/login');
  },

  updateUsername: async ({ request, cookies, fetch }) => {
    const data = await request.formData();
    const newUsername = data.get("newUsername") as string;
    const token = cookies.get('auth-token');
    
    if (!token) {
      return fail(401, { error: "Not authenticated" });
    }

    if (!newUsername) {
      return fail(400, { error: "'New username' field is required" });
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/changeUsername`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-authorization': token,
        },
        body: JSON.stringify({ newUsername }),
      });
      
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error("API returned non-JSON response:", text);
        return fail(500, { error: "Server error: Invalid response format" });
      }
      
      if (!response.ok) {
        return fail(response.status, { error: result.error || "Username change failed" });
      }
      
      return { success: true, message: "Username changed successfully!" };
    } catch (error) {
      console.error("Username change error:", error);
      return fail(500, { error: "Internal server error" });
    }
  },

  updateEmail: async ({ request, cookies, fetch }) => {
    const data = await request.formData();
    const newEmail = data.get("newEmail") as string;
    const token = cookies.get('auth-token');
    
    if (!token) {
      return fail(401, { error: "Not authenticated" });
    }

    if (!newEmail) {
      return fail(400, { error: "'New email' field is required" });
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/changeEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-authorization': token,
        },
        body: JSON.stringify({ newEmail }),
      });
      
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error("API returned non-JSON response:", text);
        return fail(500, { error: "Server error: Invalid response format" });
      }
      
      if (!response.ok) {
        return fail(response.status, { error: result.error || "Email change failed" });
      }
      
      return { success: true, message: "Email changed successfully!" };
    } catch (error) {
      console.error("Email change error:", error);
      return fail(500, { error: "Internal server error" });
    }
  },

//   updateEmail: async ({ request, cookies, fetch }) => {
//     Similar logic for email update
//   },
};