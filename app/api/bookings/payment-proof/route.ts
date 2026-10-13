import { StorageNotConfiguredError } from "@/features/admin/server/storage.service";
import { container } from "@/features/shared/server/container";
import { AppError } from "@/features/shared/server/errors";
import { clientIp } from "@/features/shared/server/request";

/** A visitor booking a session asks where to upload their payment screenshot. */
export async function POST(request: Request) {
  try {
    return Response.json(await container().payments.createProofUpload(await request.json().catch(() => null), await clientIp()));
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) return Response.json({ error: "Uploads aren't available right now." }, { status: 503 });
    if (error instanceof AppError) return Response.json({ error: error.message }, { status: 400 });
    throw error;
  }
}
