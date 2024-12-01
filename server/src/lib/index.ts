import nodemailer from "nodemailer";
import * as aws from "@aws-sdk/client-ses";
import env from "@/env";
const ses = new aws.SES({
  credentials: {
    accessKeyId: env.aws.ACCESS_KEY,
    secretAccessKey: env.aws.SECRET_KEY,
  },
  region: env.aws.REGION,
});
export const mailTransport = nodemailer.createTransport({
  SES: { ses, aws },
});
