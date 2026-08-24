import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertContentAllowed } from "@/lib/content-policy";

const isVideosBucketUrl = (u: string) => {
  try {
    const path = new URL(u).pathname;
    return path.includes("/storage/v1/object/public/videos/");
  } catch {
    return false;
  }
};

export const publishVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    mediaUrl: string;
    coverUrl?: string | null;
    title: string;
    caption?: string;
    tags?: string[];
    productTitle?: string | null;
    productUrl?: string | null;
    productCta?: string | null;
    isAffiliate?: boolean;
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
          .refine((u) => {
            try {
              return new URL(u).pathname.includes("/storage/v1/object/public/covers/");
            } catch {
              return false;
            }
          }, "coverUrl must point to the covers bucket")
          .nullish(),
        title: z.string().min(1).max(140),
        caption: z.string().max(2000).optional(),
        tags: z.array(z.string().min(1).max(40)).max(15).optional(),
        productTitle: z.string().max(80).nullish(),
        productUrl: z
          .string()
          .url()
          .refine((u) => {
            try {
              const p = new URL(u).protocol;
              return p === "http:" || p === "https:";
            } catch {
              return false;
            }
          }, "productUrl must be http or https")
          .nullish(),
        productCta: z.string().max(24).nullish(),
        isAffiliate: z.boolean().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Prefer ban columns when present; fall back if migration not applied yet.
    let profile: {
      username: string | null;
      display_name: string | null;
      is_banned?: boolean | null;
    } | null = null;

    const withBan = await supabase
      .from("profiles")
      .select("username, display_name, is_banned")
      .eq("id", userId)
      .maybeSingle();

    if (withBan.error && /is_banned/i.test(withBan.error.message)) {
      const fallback = await supabase
        .from("profiles")
        .select("username, display_name")
        .eq("id", userId)
        .maybeSingle();
      if (fallback.error) throw new Error(fallback.error.message);
      profile = fallback.data;
    } else if (withBan.error) {
      throw new Error(withBan.error.message);
    } else {
      profile = withBan.data;
    }

    if (profile?.is_banned) {
      throw new Error("This account is suspended for violating community guidelines.");
    }

    assertContentAllowed({
      username: profile?.username ?? undefined,
      displayName: profile?.display_name ?? undefined,
      title: data.title,
      caption: data.caption,
      tags: data.tags,
      productTitle: data.productTitle ?? undefined,
      productUrl: data.productUrl ?? undefined,
      productCta: data.productCta ?? undefined,
    });

    const { data: video, error } = await supabase
      .from("videos")
      .insert({
        id: crypto.randomUUID(),
        creator_id: userId,
        title: data.title,
        caption: data.caption?.trim() ?? "",
        media_url: data.mediaUrl,
        cover_url: data.coverUrl ?? null,
        tags: data.tags ?? [],
        status: "published",
        product_title: data.productUrl ? data.productTitle?.trim() || null : null,
        product_url: data.productUrl ?? null,
        product_cta: data.productUrl ? data.productCta?.trim() || "Visit" : null,
        is_affiliate: Boolean(data.productUrl && data.isAffiliate),
      })
      .select("id")
      .single();

    if (error) {
      const msg = error.message || "Could not publish video";
      if (/invalid api key/i.test(msg)) {
        throw new Error(
          "Supabase rejected the server API key. In Netlify, set SUPABASE_PUBLISHABLE_KEY to the same anon key as VITE_SUPABASE_PUBLISHABLE_KEY, then redeploy.",
        );
      }
      throw new Error(msg);
    }
    return { videoId: video.id };
  });
