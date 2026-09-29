import { container } from "@/features/shared/server/container";
import { StorageNotConfiguredError } from "@/features/admin/server/storage.service";
import { AppError } from "@/features/shared/server/errors";

export async function POST(request: Request) {
  const { sessions, storage } = container();
  const user = await sessions.current();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.isVerified) return Response.json({ error: "Your account isn't verified yet." }, { status: 403 });

  try {
    return Response.json(await storage.createImageUpload(await request.json().catch(() => null)));
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) return Response.json({ error: error.message }, { status: 503 });
    if (error instanceof AppError) return Response.json({ error: error.message }, { status: 400 });
    throw error;
  }
}
