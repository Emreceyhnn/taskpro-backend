import express from "express";
import cors from "cors";
import pino from "pino-http";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.js";
import dashboardRouter from "./routers/dashboard.js";
import { UPLOAD_DIR } from "./constants/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: "pino-pretty",
        options: { colorize: true },
      },
    })
  );

  app.use("/auth", authRouter);
  app.use("/dashboard", dashboardRouter);
  app.use("/uploads", express.static(UPLOAD_DIR));
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
