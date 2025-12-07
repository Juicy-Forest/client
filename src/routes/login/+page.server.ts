import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    try {
      const data = await request.formData();
      const email = data.get("email") as string;
      const password = data.get("password") as string;

      if (!email || !password) {
        return fail(400, { error: "Email and password are required" });
      }

      // Make API call to external server
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return fail(response.status, { error: result.message || "Login failed" });
      }

      // Store the token from the server response
      if (result.token) {
        cookies.set("auth-token", result.token, {
          path: "/",
          httpOnly: true,
          secure: false, // Set to true in production with HTTPS
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }

      return { success: true, message: result.message || "Login successful" };
    } catch (error) {
      console.error("Login error:", error);
      return fail(500, { error: "Internal server error" });
    }
  },
};
