// backend/src/scripts/seed-admin.ts
import "dotenv/config";
import { prisma } from "../app/lib/prisma";
// import auth from "../app/middlewares/auth";
import { auth } from "../app/lib/auth";
// import { prisma } from "../lib/prisma";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@yourapp.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? "Super Admin";

const seedAdmin = async () => {
  if (!ADMIN_PASSWORD) {
    console.error(
      "SEED_ADMIN_PASSWORD is not set in your environment. Aborting.",
    );
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existing) {
    if (existing.role === "ADMIN") {
      console.log(`Admin already exists: ${ADMIN_EMAIL}`);
      return;
    }

    // User exists but isn't an admin yet — promote them
    await prisma.user.update({
      where: { email: ADMIN_EMAIL },
      data: { role: "ADMIN" },
    });
    console.log(`Existing user promoted to ADMIN: ${ADMIN_EMAIL}`);
    return;
  }

  // Create the user through Better Auth so the password hash is generated correctly
  const result = await auth.api.signUpEmail({
    body: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    },
  });

  if (!result?.user) {
    console.error("Failed to create admin user via Better Auth.");
    process.exit(1);
  }

  // Better Auth's signUpEmail doesn't accept a custom "role" in the body by default,
  // so set it directly via Prisma right after creation.
  await prisma.user.update({
    where: { id: result.user.id },
    data: {
      role: "ADMIN",
      emailVerified: true, // skip email verification for the seeded admin
    },
  });

  console.log(`Admin created: ${ADMIN_EMAIL}`);
};

seedAdmin()
  .catch((err) => {
    console.error("Seed admin failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
