/** Base for expected, user-facing failures. Anything else is a bug and should surface as a 500. */
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** Input was invalid or a business rule was not met. Message is safe to show the user. */
export class ValidationError extends AppError {}

/** A unique field (slug, email) is already taken. */
export class ConflictError extends AppError {}

/** Missing, or deliberately hidden from the current user. Same message either way, so nothing leaks. */
export class NotFoundError extends AppError {
  constructor(message = "Not found.") {
    super(message);
  }
}

/** Not signed in, or the session is no longer valid. */
export class UnauthorizedError extends AppError {
  constructor(message = "Please sign in again.") {
    super(message);
  }
}
