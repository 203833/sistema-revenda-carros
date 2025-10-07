import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class AuthController {
  static async login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).send("Invalid credentials");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).send("Invalid credentials");
      }

      const token = jwt.sign(
        { 
          id: user._id, 
          username: user.username, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error during login");
    }
  }

  static async register(req: Request, res: Response) {
    const { username, password, role = 'seller' } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        password: hashedPassword,
        role
      });

      await user.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error creating user");
    }
  }
}