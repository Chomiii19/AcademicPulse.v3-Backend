class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(msg: string, statusCode: number) {
    super(msg);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "Fail" : "Error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
