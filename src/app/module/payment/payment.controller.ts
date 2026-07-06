/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { stripe } from "../../../config/stripe.config";
import { paymentService } from "./payment.service";
import { UserRole } from "../../middlewares/auth";

const initiatePayment = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { appointmentId } = req.body;

    if (!appointmentId) {
      res
        .status(400)
        .json({ success: false, message: "appointmentId is required" });
      return;
    }

    const data = await paymentService.initiatePayment(appointmentId, user.id);

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const handleStripeWebhookEvent = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  if (!signature || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret.");
    res.status(400).json({
      success: false,
      message: "Missing Stripe signature or webhook secret.",
    });
    return;
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error("Error verifying Stripe webhook signature:", error);
    res.status(400).json({
      success: false,
      message: "Webhook signature verification failed",
    });
    return;
  }

  try {
    const result = await paymentService.handleStripeWebhookEvent(event);

    res.status(200).json({
      success: true,
      message: result?.message ?? "",
    });
  } catch (error: any) {
    console.error("Error processing Stripe webhook event:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyPayments = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id || !user?.role) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const data = await paymentService.getMyPayments(
      user.id,
      user.role as UserRole,
    );

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const paymentController = {
  initiatePayment,
  handleStripeWebhookEvent,
  getMyPayments,
};
