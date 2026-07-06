import express, { Application, Request, Response } from "express";
import cors from "cors";
import { auth } from "./app/lib/auth";
import { toNodeHandler } from "better-auth/node";
import { indexRoutes } from "./app/routes";
import { paymentController } from "./app/module/payment/payment.controller";

const app: Application = express();
export const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON payloads

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleStripeWebhookEvent,
);

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/v1", indexRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello, your updated TypeScript Express server is running!",
  });
});

export default app;
