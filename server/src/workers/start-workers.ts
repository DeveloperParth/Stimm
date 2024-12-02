import { Worker } from "bullmq";

const workers = ["mail-worker"];
workers.forEach((workerFolder) => {
  const worker = require(`./${workerFolder}/worker`).default;
  if (!(worker instanceof Worker)) throw new Error("Invalid worker");
  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });
  worker.on("failed", (job, err) => {
    console.log(`Job ${job?.id} failed`);
    console.log("🚀 ~ worker.on ~ err:", err);
  });
  worker.on("error", (err) => {
    console.log(err);
  });
});
