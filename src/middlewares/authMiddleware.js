import createHttpError from "http-errors";
import { findSessionByAccessToken } from "../services/auth.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw createHttpError(401, "Authorization header missing");
    }

    const [type, accessToken] = authorization.split(" ");

    if (type !== "Bearer" || !accessToken) {
      throw createHttpError(401, "Invalid authorization format");
    }

    const session = await findSessionByAccessToken(accessToken);

    req.user = session.userId;

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
