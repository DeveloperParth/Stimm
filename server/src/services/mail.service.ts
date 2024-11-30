import { sendMailSchema, SendMailSchema } from "../validation";
import { mailQueue } from "../workers";

export class MailService {
  async sendMail(payload: SendMailSchema): Promise<void> {
    const data = sendMailSchema.parse(payload);
    await mailQueue.add("sendMail", data);
  }
}
