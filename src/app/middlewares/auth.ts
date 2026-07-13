/* eslint-disable @typescript-eslint/no-namespace */
import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export enum UserRole {
  admin = "ADMIN",
  user = "USER",
  patient = "PATIENT",
  psychologist = "PSYCHOLOGIST",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
        isVerified: boolean;
      };
    }
  }
}

const authMiddle = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized!",
      });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as UserRole,
      isVerified: session.user.isVerified as boolean,
    };

    // Admins are exempt — they're the ones doing the verifying
    if (req.user.role !== UserRole.admin && !req.user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Your account is pending admin verification.",
      });
    }

    if (roles && !roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden Access!! You are not allowed to access this route",
      });
    }

    next();
  };
};

export default authMiddle;
