import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { UserRoles } from "../generated/prisma/browser.js";
// // If your Prisma file is located elsewhere, you can change the path

// export const auth = betterAuth({
//   baseURL: process.env.BETTER_AUTH_URL,
//   database: prismaAdapter(prisma, {
//     provider: "postgresql", // or "mysql", "postgresql", ...etc
//   }),

//   trustedOrigins: [
//     "http://localhost:3000",
//     "https://psycho-support-frontend.vercel.app",
//     "http://localhost:5000",
//   ],

//   emailAndPassword: {
//     enabled: true,
//   },

//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         required: true,
//         defaultValue: UserRoles.USER,
//       },
//       isDeleted: {
//         type: "boolean",
//         required: true,
//         defaultValue: false,
//       },
//       deletedAt: {
//         type: "date",
//         required: false,
//         defaultValue: null,
//       },
//     },
//   },
// });

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  advanced: {
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    "http://localhost:3000",
    "https://psycho-support-frontend.vercel.app",
  ],

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRoles.USER,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },
});
