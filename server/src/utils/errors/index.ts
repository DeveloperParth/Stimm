class UnauthorizedError extends Error {
  status: number;
  data: any;
  constructor(message = "Unauthorized", data?: any) {
    super(message);
    this.name = "UnauthorizedError";
    this.status = 401;
    this.data = data;
  }
}

export { UnauthorizedError };
