import { Stripe } from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../../generated/prisma/enums";
import { UserRole } from "../../middlewares/auth";
import { stripe } from "../../../config/stripe.config";
// import { stripe } from "../../../config/stripe.config";
// import { envVars } from "../../../config/env";

const APPOINTMENT_PRICE = 50.0; // adjust or make dynamic per psychologist

const initiatePayment = async (appointmentId: string, userId: string) => {
  const patient = await prisma.patient.findUnique({
    where: { userId },
  });

  if (!patient) {
    throw new Error("Patient profile not found for this user");
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.patientId !== patient.id) {
    throw new Error("You can only pay for your own appointment");
  }

  if (appointment.paymentStatus === PaymentStatus.COMPLETED) {
    throw new Error("This appointment has already been paid for");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { appointmentId },
  });

  const payment =
    existingPayment ??
    (await prisma.payment.create({
      data: {
        appointmentId,
        amount: APPOINTMENT_PRICE,
        status: PaymentStatus.PENDING,
      },
    }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(APPOINTMENT_PRICE * 100), // Stripe expects cents
          product_data: { name: "Appointment booking (60 min)" },
        },
        quantity: 1,
      },
    ],
    metadata: {
      appointmentId,
      paymentId: payment.id,
    },
    success_url: `${process.env.CLIENT_URL}/payment-success?appointmentId=${appointmentId}`,
    cancel_url: `${process.env.CLIENT_URL}/payment-cancelled?appointmentId=${appointmentId}`,
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { transactionId: session.id },
  });

  return { checkoutUrl: session.url };
};

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: { stripeEventId: event.id },
  });

  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping.`);
    return { message: `Event ${event.id} already processed. Skipping.` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const appointmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;

      if (!appointmentId || !paymentId) {
        console.error(
          "Missing appointmentId or paymentId in session metadata.",
        );
        return {
          message: "Missing appointmentId or paymentId in session metadata.",
        };
      }

      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
      });

      if (!appointment) {
        console.error(`Appointment with ID ${appointmentId} not found.`);
        return { message: `Appointment with ID ${appointmentId} not found.` };
      }

      const newStatus =
        session.payment_status === "paid"
          ? PaymentStatus.COMPLETED
          : PaymentStatus.FAILED;

      await prisma.$transaction(async (tx) => {
        await tx.appointment.update({
          where: { id: appointmentId },
          data: { paymentStatus: newStatus },
        });

        await tx.payment.update({
          where: { id: paymentId },
          data: {
            stripeEventId: event.id,
            status: newStatus,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            paymentgatewayData: session as any,
          },
        });
      });

      console.log(
        `Processed checkout.session.completed for appointment ${appointmentId}, payment ${paymentId}`,
      );
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object;
      const paymentId = session.metadata?.paymentId;

      if (paymentId) {
        await prisma.payment.update({
          where: { id: paymentId },
          data: { status: PaymentStatus.FAILED, stripeEventId: event.id },
        });
      }

      console.log(`Checkout session expired: ${session.id}`);
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object;
      console.log(`Payment intent failed: ${intent.id}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return { message: "Webhook processed" };
};

const getMyPayments = async (userId: string, role: UserRole) => {
  if (role === UserRole.admin) {
    return prisma.payment.findMany({
      include: {
        appointment: {
          include: { patient: true, psychologist: true },
        },
      },
      orderBy: { paymentDate: "desc" },
    });
  }

  if (role === UserRole.patient) {
    const patient = await prisma.patient.findUnique({ where: { userId } });

    if (!patient) {
      throw new Error("Patient profile not found for this user");
    }

    return prisma.payment.findMany({
      where: { appointment: { patientId: patient.id } },
      include: {
        appointment: { include: { psychologist: true } },
      },
      orderBy: { paymentDate: "desc" },
    });
  }

  if (role === UserRole.psychologist) {
    const psychologist = await prisma.psychologist.findUnique({
      where: { userId },
    });

    if (!psychologist) {
      throw new Error("Psychologist profile not found for this user");
    }

    const payments = await prisma.payment.findMany({
      where: { appointment: { psychologistid: psychologist.id } },
      include: {
        appointment: { include: { patient: true } },
      },
      orderBy: { paymentDate: "desc" },
    });

    const totalIncome = await prisma.payment.aggregate({
      where: {
        appointment: { psychologistid: psychologist.id },
        status: PaymentStatus.COMPLETED,
      },
      _sum: { amount: true },
    });

    return {
      payments,
      totalIncome: totalIncome._sum.amount ?? 0,
    };
  }

  throw new Error("Invalid role");
};

export const paymentService = {
  initiatePayment,
  handleStripeWebhookEvent,
  getMyPayments,
};
