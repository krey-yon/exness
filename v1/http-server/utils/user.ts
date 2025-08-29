import type { Request, Response } from "express";
import { users } from "./inMemoryDb";

export const createUser = (req: Request, res: Response) => {
  const { name } = req.body;

  const newUser = {
    id: 123,
    name: name || "guest",
    balance: 10000,
    position: { Long: [], Short: [] },
  };

  users.push(newUser);

  res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
};

export const signUser = (req: Request, res: Response) => {
  const { id } = req.body;

  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    message: "Signed in successfully",
    user,
  });
};
