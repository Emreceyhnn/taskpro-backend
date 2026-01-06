import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const initMongoConnection = async () => {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
    process.env;

  if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
    throw new Error("Mongo env vars missing: MONGODB_USER/PASSWORD/URL/DB");
  }

  const encodedPassword = encodeURIComponent(MONGODB_PASSWORD);

  const url = `mongodb+srv://${MONGODB_USER}:${encodedPassword}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  mongoose.set("strictQuery", true);

  await mongoose.connect(url);
  console.log("Mongo connection successful");
};
