import { Queue } from "bullmq";
import { SendMailSchema } from "@/validation";
import { mailWorkerConstants } from "@/workers/mail-worker/constant";
import { bullConnection } from "@/workers/helper";

const queue = new Queue<SendMailSchema, never>(mailWorkerConstants.key, {
  connection: bullConnection,
});

export { queue as mailQueue };
