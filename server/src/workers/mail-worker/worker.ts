import { Worker } from "bullmq";
import { bullConnection } from "../helper";
import { sendMailSchema, SendMailSchema } from "../../validation";
import { mailTransport } from "@/lib";
import { compile } from "@/templates";
import { mailWorkerConstants } from "./constant";

const worker = new Worker<SendMailSchema>(
  mailWorkerConstants.key,
  async (job) => {
    const data = sendMailSchema.parse(job.data);
    const html = await compile(data.template, data.context);
    await mailTransport.sendMail({
      to: data.to,
      subject: data.subject,
      html,
    });
  },
  {
    connection: bullConnection,
  }
);

export default worker;
