import { fail, type Actions } from "@sveltejs/kit";
import User from "$lib/models/User";
import initDatabase from "$lib/db";

export const actions: Actions = {
  register: async ({ request }) => {
    try {
      await initDatabase();

      const data = await request.formData();
      const firstName = data.get("firstName") as string;
      const lastName = data.get("lastName") as string;
      const email = data.get("email") as string;
      const password = data.get("password") as string;

      if (!firstName || !lastName || !email || !password) {
        return fail(400, { error: "All fields are required" });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return fail(400, { error: "User with this email already exists" });
      }

      // Create new user
      const user = new User({
        firstName,
        lastName,
        email,
        password,
      });

      await user.save();

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
