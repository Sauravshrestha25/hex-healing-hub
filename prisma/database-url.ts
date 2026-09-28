/**
 * Postgres connection string. DATABASE_URL wins when set (e.g. in .env.local for local dev);
 * otherwise it is built from DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME,
 * URL-encoding the credentials so passwords with @ : / # etc. work.
 */
export function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const { DB_HOST, DB_PORT = "5432", DB_USER, DB_PASSWORD = "", DB_NAME } = process.env;
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error("Set DATABASE_URL, or DB_HOST, DB_USER and DB_NAME (plus DB_PORT / DB_PASSWORD).");
  }
  const auth = DB_PASSWORD ? `${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}` : encodeURIComponent(DB_USER);
  return `postgresql://${auth}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}
