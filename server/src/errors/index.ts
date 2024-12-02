type CommonErrorConstructor = {
  message?: string;
};
class NotFoundError extends Error {
  status: number = 404;
  constructor(options: CommonErrorConstructor & { resource?: string } = {}) {
    const message = options.message || "Not Found";
    super(message);
    this.name = "NotFoundError";
  }
}
class UnauthorizedError extends Error {
  status: number = 401;
  constructor(options: CommonErrorConstructor = {}) {
    const message = options.message || "Unauthorized";
    super(message);
    this.name = "UnauthorizedError";
  }
}
const errors = {
  NotFoundError,
  UnauthorizedError,
};
export default errors;
