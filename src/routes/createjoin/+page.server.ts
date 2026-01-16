import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3030";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  const token = cookies.get("auth-token");

  if (!token) {
    return { joinedGardens: [] };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/garden/user`, {
      headers: {
        "x-authorization": token,
      },
    });

    if (response.ok) {
      const joinedGardens = await response.json();
      return { joinedGardens };
    }
  } catch (error) {
    console.error("Failed to fetch joined gardens:", error);
  }

  return { joinedGardens: [] };
};

export const actions: Actions = {
  create: async ({ request, cookies, fetch }) => {
    const data = await request.formData();
    const name = data.get("name") as string;
    const location = data.get("location") as string;

    if (!name || !location) {
      return fail(400, { error: "Name and location are required" });
    }

    const token = cookies.get("auth-token");
    if (!token) {
      return fail(401, { error: "Not authenticated" });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/garden`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-authorization": token,
        },
        body: JSON.stringify({
          name,
          location,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return fail(response.status, { error: "The name already exists" });
      }

      return {
        success: true,
        message: `Food garden "${result.name}" created successfully!`,
        garden: result,
      };
    } catch (error) {
      console.error("Create garden error:", error);
      return fail(500, { error: "Internal server error" });
    }
  },

  join: async ({ request, cookies, fetch }) => {
    const data = await request.formData();
    const joinCode = data.get("joinCode") as string;

    if (!joinCode) {
      return fail(400, { error: "Join code is required" });
    }

    const token = cookies.get("auth-token");
    if (!token) {
      return fail(401, { error: "Not authenticated" });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/garden/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-authorization": token,
        },
        body: JSON.stringify({
          joinCode: joinCode.trim().toUpperCase(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return fail(response.status, {
          error: result.message || "Failed to join garden",
        });
      }

      return {
        success: true,
        message: `Successfully joined "${result.name}" garden!`,
        garden: result,
      };
    } catch (error) {
      console.error("Join garden error:", error);
      return fail(500, { error: "Internal server error" });
    }
  },
};
