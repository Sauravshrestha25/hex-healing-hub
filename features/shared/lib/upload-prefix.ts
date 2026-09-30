/**
 * Folder in the R2 bucket that this environment writes to and is allowed to delete from.
 * Local development shares the bucket with the live site, so it gets its own folder:
 * nothing done locally can remove a live file.
 */
export function uploadPrefix() {
  return process.env.NODE_ENV === "production" ? "uploads/" : "dev-uploads/";
}
