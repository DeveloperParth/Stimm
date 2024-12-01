import { Queue, Worker } from "bullmq";
import { bullConnection } from "../helper";
import { sendMailSchema, SendMailSchema } from "../../validation";

const key = "mail";

const worker = new Worker<SendMailSchema>(
  key,
  async (job) => {
    const data = sendMailSchema.parse(job.data);
    console.log("Sending mail to", data.to);
  },
  {
    connection: bullConnection,
  }
);

export default worker;
