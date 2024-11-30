import { Queue, Worker } from "bullmq";
import { bullConnection } from "./helper";
import { SendMailSchema } from "../validation";

const key = "mail";
const queue = new Queue<SendMailSchema, never>(key, {
  connection: bullConnection,
});
const worker = new Worker(
  key,
  async (job) => {
    console.log("Sending mail to", job.data.email);
  },
  {
    connection: bullConnection,
  }
);

export { queue as mailQueue, worker as mailWorker };
