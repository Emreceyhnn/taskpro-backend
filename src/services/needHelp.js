import { NeedHelp } from "../db/models/needHelp.js";

export const needHelpService = async ({ email, comment }) => {
  const needHelp = await NeedHelp.create({ email, comment });

  return needHelp;
};
