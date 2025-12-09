//updated
import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface AuthInput {
  name?: string;
  email: string;
  password: string;
}

export const register = async ({ name, email, password }: AuthInput) => {
  if (!name || !email || !password) throw new Error("All fields are required");

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  return user;
};

export const login = async ({ email, password }: AuthInput) => {
  if (!email || !password) throw new Error("Email and password are required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
    expiresIn: "1d",
  });

  return { user, token };
};
