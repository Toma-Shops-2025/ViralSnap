import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const STORAGE_BASE = `${process.env.SUPABASE_URL ?? ""}/storage/v1/object/public/`;
const isVideosBucketUrl = (u: string) =>
  STORAGE_BASE !== "/storage/v1/object/public/" &&
  u.startsWith(`${STORAGE_BASE}videos/`);

export const publishVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    mediaUrl: string;
    coverUrl?: string | null;
    title: string;
    caption?: string;
    tags?: string[];
  }) =>
    z
      .object({
        mediaUrl: z
          .string()
          .url()
          .refine(isVideosBucketUrl, "mediaUrl must point to the videos bucket"),
        coverUrl: z
          .string()
          .url()
          .refine(
            (u) =>
              STORAGE_BASE !== "/storage/v1/object/public/" &&
              u.startsWith(`${STORAGE_BASE}covers/`),
            "coverUrl must point to the covers bucket",
          )
          .nullish(),
        title: z.string().min(1).max(140),
        caption: z.string().max(2000).optional(),
        tags: z.array(z.string().min(1).max(40)).max(15).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: video, error } = await supabase
      .from("videos")
      .insert({
        creator_id: userId,
        title: data.title,
        caption: data.caption?.trim() ?? "",
        media_url: data.mediaUrl,
        cover_url: data.coverUrl ?? null,
        tags: data.tags ?? [],
        status: "published",
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { videoId: video.id };
  });
