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
const errors = {
  NotFoundError,
};
export default errors;
