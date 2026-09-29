import "server-only";
import { cache } from "react";
import { container } from "@/features/shared/server/container";

/** The signed-in dashboard user, looked up once per request (layout + page share it). */
export const getViewer = cache(() => container().sessions.requirePage());
