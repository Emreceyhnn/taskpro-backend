import SibApiV3Sdk from "sib-api-v3-sdk";
import "dotenv/config";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async ({ to, subject, html, text }) => {
  await apiInstance.sendTransacEmail({
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME,
    },
    to: [{ email: to }],
    subject,
    htmlContent: html,
    textContent: text,
    templateId: 345,
  });
};
