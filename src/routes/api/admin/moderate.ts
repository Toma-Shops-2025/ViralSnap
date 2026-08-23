import { createFileRoute } from "@tanstack/react-router";
import { takedownUserById, takedownUserByUsername } from "@/lib/moderation.server";

export const Route = createFileRoute("/api/admin/moderate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret =
          process.env.MODERATION_SECRET ?? process.env.MEDIA_RESTORE_SECRET;
        if (!secret) {
          return new Response(JSON.stringify({ error: "MODERATION_SECRET not configured" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          });
        }

        let body: { secret?: string; username?: string; userId?: string; reason?: string } =
          {};
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
          const reason = body.reason?.trim() || "policy violation";
          const result = body.userId
            ? await takedownUserById(body.userId, reason)
            : body.username
              ? await takedownUserByUsername(body.username, reason)
              : null;

          if (!result) {
            return new Response(JSON.stringify({ error: "Provide username or userId" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ ok: true, ...result }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          console.error("moderate failed:", e);
          return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Moderation failed" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
