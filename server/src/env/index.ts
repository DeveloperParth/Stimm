export default {
  mail: {
    from: process.env.MAIL_USER!,
  },
  tokens: {
    access_secret: process.env.JWT_SECRET!,
  },
};
