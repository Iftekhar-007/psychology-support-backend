// import Stripe from "stripe";
// // import { envVars } from "./env";

import { Stripe } from "stripe";

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
