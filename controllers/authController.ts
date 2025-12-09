  //updated
  import { Request, Response } from "express";
  import * as authService from "../services/authService";

  // Register
  export const registerUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const user = await authService.register({ name, email, password });
      const { token } = await authService.login({ email, password });

      res.status(201).json({
        message: "User registered successfully",
        user: { id: user._id, name: user.name, email: user.email },
        token,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  // Login
  export const loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password, cookiesAccepted } = req.body;

      const { user, token } = await authService.login({ email, password });

      // Set httpOnly cookie if user accepted
      if (cookiesAccepted) {
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }

      res.status(200).json({
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email },
        token,
        cookiesAccepted,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };
