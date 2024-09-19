import env from "@/env";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
const mailSendCallback = (error: Error | null, info: any) => {
  if (error) {
    throw error;
  }
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
function sendAccountVerificationMail(email: string, link: string) {
  transporter.sendMail(
    {
      from: env.mail.from,
      to: email,
      subject: "Email verification",
      html: `<a href=${link}>Verify your account</a>`,
    },
    mailSendCallback
  );
}
function sendPasswordResetMail(email: string, link: string) {
  transporter.sendMail(
    {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Change password",
      html: `<a href=${link}>Change your password</a>`,
    },
    mailSendCallback
  );
}
export { transporter, sendAccountVerificationMail, sendPasswordResetMail };
