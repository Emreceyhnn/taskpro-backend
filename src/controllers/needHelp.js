import { needHelpService } from "../services/needHelp.js";

export const needHelpController = async (req, res) => {
  const needHelp = await needHelpService(req.body);

  res.status(201).json({
    status: 201,
    message: "Comment Sended",
    data: needHelp,
  });
};
