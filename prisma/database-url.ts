/**
 * Postgres connection string. DATABASE_URL wins when set (e.g. in .env.local for local dev);
 * otherwise it is built from DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME,
 * URL-encoding the credentials so passwords with @ : / # etc. work.
 * Undefined when nothing is configured (e.g. during `next build`); queries then fail at run time.
 */
export function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const { DB_HOST, DB_PORT = "5432", DB_USER, DB_PASSWORD = "", DB_NAME } = process.env;
  if (!DB_HOST || !DB_USER || !DB_NAME) return undefined;
  const auth = DB_PASSWORD ? `${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}` : encodeURIComponent(DB_USER);
  return `postgresql://${auth}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

/** For scripts that can't do anything without a database. */
export function requireDatabaseUrl() {
  const url = databaseUrl();
  if (!url) throw new Error("Set DATABASE_URL, or DB_HOST, DB_USER and DB_NAME (plus DB_PORT / DB_PASSWORD).");
  return url;
}
