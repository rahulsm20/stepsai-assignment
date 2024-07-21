import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { connectRedis, disconnectRedis, redisClient } from "../utils/redis";
dotenv.config();
import { Patient } from "@prisma/client"; // Import your Prisma Client types

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        firstName: string;
        lastName: string;
        username: string;
      };
    }
  }
}
export const Login: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.patient.findUnique({
      where: {
        username,
      },
      include: {
        interactions: true,
        messages: true,
        doctor: true,
      },
    });
    if (!user) {
      throw new Error("User doesn't exist");
    }
    const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
    if (passwordMatches) {
      const token = jwt.sign(
        JSON.stringify({ id: user.id }),
        process.env.JWT_SECRET || ""
      );
      await connectRedis();
      await redisClient.set(`sid:${token}`, user.id, {
        EX: 60 * 60 * 24,
      });
      await disconnectRedis();
      const secureCookie = process.env.NODE_ENV === "production";
      console.log("secureCookie:", secureCookie);

      res.cookie("session_token", token, {
        maxAge: 100 * 10 * 60 * 60 * 24,
        signed: true,
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: secureCookie,
      });
      const { hashedPassword: pass, ...formattedUser } = user;

      return res.status(200).json(formattedUser);
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
};

export const Signup: RequestHandler = async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    if (!firstName || !lastName || !username || !password) {
      throw new Error("Please enter all details");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        hashedPassword,
        username,
      },
      include: {
        interactions: true,
        messages: true,
      },
    });
    const token = jwt.sign(user, process.env.JWT_SECRET || "");
    await connectRedis();
    await redisClient.set(`sid:${token}`, user.id, {
      EX: 60 * 60 * 24,
    });
    await disconnectRedis();
    const secureCookie = process.env.NODE_ENV === "production";
    res.cookie("session_token", token, {
      maxAge: 100 * 10 * 60 * 60 * 24,
      signed: true,
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: secureCookie,
    });
    const { hashedPassword: pass, ...formattedUser } = user;
    return res.status(200).json(formattedUser);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
};

export const Profile: RequestHandler = async (req, res) => {
  try {
    const { session_token } = req.signedCookies;
    await connectRedis();
    const userId = await redisClient.get(`sid:${session_token}`);
    if (userId == null) {
      return res.status(404).json("Invalid Token");
    }
    const user = await prisma.patient.findUnique({
      where: { id: parseInt(userId, 10) },
      include: {
        interactions: true,
        messages: true,
        doctor: true,
      },
    });
    if (!user) {
      throw new Error("User doesn't exist");
    }
    const { hashedPassword: pass, ...formattedUser } = user;

    return res.status(200).json(formattedUser);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  } finally {
    await disconnectRedis();
  }
};

export const requiresAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { session_token } = req.signedCookies;
    await connectRedis();
    const userId = await redisClient.get(`sid:${session_token}`);
    await disconnectRedis();
    if (userId == null) {
      return res.status(404).json("Invalid Token");
    }
    const user = await prisma.patient.findUnique({
      where: { id: parseInt(userId, 10) },
      include: {
        interactions: true,
        messages: true,
        doctor: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const { hashedPassword: pass, ...formattedUser } = user;
    req.user = formattedUser;
    next();
  } catch (err) {
    return res.status(404).json(err);
  }
};

export const Logout: RequestHandler = async (req, res) => {
  try {
    const { session_token } = req.signedCookies;
    if (!session_token) {
      throw new Error("no session token");
    }
    await connectRedis();
    await redisClient.del(`sid:${session_token}`);
    await disconnectRedis();
    res.clearCookie("session_token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.redirect(process.env.CLIENT_URL || "");
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
};
