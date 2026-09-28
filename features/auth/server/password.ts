import "server-only";
import { compare, hash } from "bcryptjs";

export { MIN_PASSWORD_LENGTH } from "@/features/auth/lib/password-policy";

// A valid hash compared against when an account doesn't exist, so timing doesn't reveal which emails are registered.
const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEeO5fQXkdMyaQ7kHZq1Mb2hQCyl6MZ7w2y";

export class PasswordHasher {
  hash(password: string) {
    return hash(password, 12);
  }

  verify(password: string, passwordHash: string | null | undefined) {
    return compare(password, passwordHash ?? DUMMY_HASH);
  }
}
