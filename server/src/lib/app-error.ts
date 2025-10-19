class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  constructor({
    status = 500,
    message,
    isOperational = true,
  }: {
    status?: number;
    message: string;
    isOperational?: boolean;
  }) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.statusCode = status;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}
export default AppError;

// throw new AppError({status: 404, message: "Not Found", isOperational: true});
