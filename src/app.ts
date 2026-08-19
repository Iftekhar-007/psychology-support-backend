import express, { Application, Request, Response } from "express";
import cors from "cors";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import { indexRoutes } from "./app/routes/index.js";
import { paymentController } from "./app/module/payment/payment.controller.js";

const app: Application = express();
export const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.BETTER_AUTH_URL,
  "https://psychology-support-backend-2ej8dc67c-iftekhar-007s-projects.vercel.app",
  process.env.BETTER_AUTH_TRUSTED_ORIGINS, // Production frontend URL
].filter(Boolean);

// Middleware to parse incoming JSON payloads

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleStripeWebhookEvent,
);

app.use(express.json());

// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://localhost:5000"],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
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
