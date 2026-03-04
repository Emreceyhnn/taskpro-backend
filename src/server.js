import express from "express";
import cors from "cors";
import pino from "pino-http";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.js";
import dashboardRouter from "./routers/dashboard.js";
import { UPLOAD_DIR } from "./constants/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { swaggerDocs } from "./middlewares/swagger.js";

export const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(express.json());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "https://taskpro.emreceyhan.xyz",
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(
    pino({
      transport:
        process.env.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: { colorize: true },
            }
          : undefined,
    }),
  );

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/auth", authRouter);
  app.use("/dashboard", dashboardRouter);
  app.use("/uploads", express.static(UPLOAD_DIR));
  app.use("/api-docs", swaggerDocs());
  app.use(errorHandler);

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}`);
  });
};
