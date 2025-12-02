import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import User from "$lib/models/User";
import initDatabase from "$lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    try {
      await initDatabase();

      const data = await request.formData();
      const email = data.get("email") as string;
      const password = data.get("password") as string;

      if (!email || !password) {
        return fail(400, { error: "Email and password are required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return fail(401, { error: "Invalid email or password" });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return fail(401, { error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      cookies.set("auth-token", token, {
        path: "/",
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return { success: true, message: "Login successful" };
    } catch (error) {
      console.error("Login error:", error);
      return fail(500, { error: "Internal server error" });
    }
  },
};
