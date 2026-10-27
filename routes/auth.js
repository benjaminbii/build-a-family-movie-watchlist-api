
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findByUsername } from "../utils/db.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check that both fields were provided.
  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required."
    });
  }

  // Find the user by username.
  const user = findByUsername(username);

  if (!user) {
    return res.status(401).json({
      error: "Invalid username or password."
    });
  }

  // Compare the submitted password with the stored hash.
  const passwordMatches = bcrypt.compareSync(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    return res.status(401).json({
      error: "Invalid username or password."
    });
  }

  // Create a token containing the user's identity and role.
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(200).json({ token });
});

export default router;
