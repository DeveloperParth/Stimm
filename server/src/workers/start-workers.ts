import { mailWorker } from "./mail.worker";

const workers = [mailWorker];

workers.forEach((worker) => {
  worker.on("completed", (job) => {
    console.log(`Job with id ${job.id} has been completed`);
  });
  worker.on("failed", (job, err) => {
    console.log(
      `Job with id ${job?.id} has been failed with error ${err.message}`
    );
  });
});
