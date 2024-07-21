import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import authRoutes from "./routes/AuthRoutes";
import QueryRoutes from "./routes/QueryRoutes";
import userRoutes from "./routes/UserRoutes";
import { requiresAuth } from "./controllers/auth";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cookieParser(process.env.TOKEN_SECRET));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/status", async (req: Request, res: Response) => {
  return res.status(200).json({ message: "Service running", status: "ok" });
});

app.use("/conversations", requiresAuth, QueryRoutes);
app.use("/user", requiresAuth, userRoutes);

app.get("/", (req, res) => {
  res.redirect(process.env.CLIENT_URL || "");
});

app.get("*", async (req: Request, res: Response) => {
  return res.status(404).json("Invalid route");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
