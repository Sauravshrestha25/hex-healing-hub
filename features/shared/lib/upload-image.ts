/**
 * Uploads straight to R2 via a signed URL from `endpoint` and returns the file's public URL.
 * The dashboard's endpoint needs a signed-in editor; the booking form has its own for payment screenshots.
 */
export async function uploadImage(file: File, endpoint = "/api/admin/uploads") {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Upload failed.");

  const put = await fetch(data.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
  if (!put.ok) throw new Error("Upload to storage failed. Please try again.");
  return data.publicUrl as string;
}
