import { eq } from "drizzle-orm";
import { db } from "../db";
import { otps, User, users } from "../db/models";
import errors from "../errors";
import { InitializeLoginSchema, VerifyLoginSchema } from "../validation";
import { MailService } from "./mail.service";

export class UserService {
  constructor(private readonly mailService: MailService) {}
  async findUserByEmail(emailAddress: string, shouldThrow: true): Promise<User>;
  async findUserByEmail(
    emailAddress: string,
    shouldThrow?: false
  ): Promise<User | undefined>;
  async findUserByEmail(
    emailAddress: string,
    shouldThrow: boolean = false
  ): Promise<User | undefined> {
    const user = await db.query.users.findFirst({
      where: ({ email }, { eq }) => eq(email, emailAddress),
    });
    if (!user && shouldThrow) {
      throw new errors.NotFoundError();
    }
    return user;
  }
  async findUserById(userId: string, shouldThrow: true): Promise<User>;
  async findUserById(
    userId: string,
    shouldThrow?: false
  ): Promise<User | undefined>;
  async findUserById(
    userId: string,
    shouldThrow: boolean = false
  ): Promise<User | undefined> {
    const user = await db.query.users.findFirst({
      where: ({ id }, { eq }) => eq(id, userId),
    });
    if (!user && shouldThrow) {
      throw new errors.NotFoundError();
    }
    return user;
  }
  async initializeLogin(data: InitializeLoginSchema) {
    let user = await this.findUserByEmail(data.email);
    if (!user) {
      user = await this.createNewUser({ email: data.email });
    }
    await db.insert(otps).values({
      userId: user.id,
      otp: this.generateOtp(),
    });
    await this.mailService.sendMail({
      to: user.email,
      subject: "Login OTP",
      template: "login-otp",
      context: {
        otp: this.generateOtp(),
      },
    });
    return;
  }
  async verifyLogin(data: VerifyLoginSchema) {
    const user = await this.findUserByEmail(data.email, true);
    const otpsData = await db.query.otps.findMany({
      where: ({ userId, otp }, { eq }) => eq(userId, user.id),
    });
    const otp = otpsData.find((otp) => otp.otp === data.otp);
    if (!otp) {
      throw new errors.UnauthorizedError({ message: "Invalid OTP" });
    }
    await db.delete(otps).where(eq(otps.id, otp.id));
    return;
  }
  async createNewUser(data: { email: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email: data.email,
      })
      .returning();
    return user;
  }
  private generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
