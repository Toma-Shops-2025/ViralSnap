import { createFileRoute } from "@tanstack/react-router";
import { restoreViralSnapPlayback } from "@/lib/media-restore.server";

export const Route = createFileRoute("/api/admin/restore-media")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.MEDIA_RESTORE_SECRET;
        if (!secret) {
          return new Response(JSON.stringify({ error: "MEDIA_RESTORE_SECRET not configured" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          });
        }

        let body: { secret?: string } = {};
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (body.secret !== secret) {
          return new Response(JSON.stringify({ error: "Forbidden" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const result = await restoreViralSnapPlayback();
          return new Response(JSON.stringify({ ok: true, ...result }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          console.error("restore-media failed:", e);
          return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Restore failed" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
