// netlify/functions/image.js

import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return new Response("Paramètre 'key' manquant", { status: 400 });
  }

  const store = getStore("product-images");
  const blob = await store.get(key, { type: "arrayBuffer" });

  if (!blob) {
    return new Response("Image introuvable", { status: 404 });
  }

  const metadata = await store.getMetadata(key);
  const contentType = metadata?.metadata?.contentType || "image/jpeg";

  return new Response(blob, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
