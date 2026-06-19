import express, { Application, Request, Response } from "express";
import { auth } from "./app/lib/auth";
import { toNodeHandler } from "better-auth/node";

const app: Application = express();
export const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON payloads
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

// Sample Route with Explicit TypeScript Types
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello, your updated TypeScript Express server is running!",
  });
});

export default app;
