import { fail, type Actions } from "@sveltejs/kit";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3030";

export const actions: Actions = {
  register: async ({ request, fetch }) => {
    try {
      const data = await request.formData();
      const username = data.get("username") as string;
      const email = data.get("email") as string;
      const password = data.get("password") as string;

      if (!username || !email || !password) {
        return fail(400, { error: "All fields are required" });
      }

      // Make API call to backend
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return fail(response.status, { error: result.error || "Registration failed" });
      }

      return {
        success: true,
        message: "Registration successful! Please log in.",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return fail(500, { error: "Internal server error" });
    }
  },
};
