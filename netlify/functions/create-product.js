// netlify/functions/create-product.js

import { getDatabase } from "@netlify/database";
import { getStore } from "@netlify/blobs";
import { randomUUID } from "node:crypto";

const STORE_SLUG = "eta-market";

async function getOrCreateStore(db) {
  const existing = await db.sql`SELECT id FROM stores WHERE slug = ${STORE_SLUG}`;
  if (existing.length > 0) return existing[0].id;

  const [vendor] = await db.sql`
    INSERT INTO vendors (full_name, email, phone, password_hash, status)
    VALUES ('Admin ETA MARKET', 'admin@etamarket.cg', '+242000000000', 'not_set', 'active')
    RETURNING id
  `;
  const [store] = await db.sql`
    INSERT INTO stores (vendor_id, name, slug, is_published)
    VALUES (${vendor.id}, 'ETA MARKET', ${STORE_SLUG}, TRUE)
    RETURNING id
  `;
  return store.id;
}

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Méthode non autorisée", { status: 405 });
  }

  try {
    const body = await req.json();
    const { name, price, oldPrice, description, category, badge, imageBase64, imageType } = body;

    if (!name || !price || !imageBase64) {
      return new Response(
        JSON.stringify({ error: "name, price et imageBase64 sont obligatoires" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const ext = (imageType || "image/jpeg").split("/")[1] || "jpg";
    const imageKey = `${randomUUID()}.${ext}`;
    const imageBuffer = Buffer.from(imageBase64, "base64");

    const blobStore = getStore("product-images");
    await blobStore.set(imageKey, imageBuffer, {
      metadata: { contentType: imageType || "image/jpeg" },
    });

    const imageUrl = `/.netlify/functions/image?key=${imageKey}`;

    const db = getDatabase();
    const storeId = await getOrCreateStore(db);

    const [product] = await db.sql`
      INSERT INTO products (store_id, name, description, price_fcfa, compare_at_price_fcfa, image_url, category, badge, stock_quantity, is_active)
      VALUES (
        ${storeId}, ${name}, ${description || ""}, ${parseInt(price, 10)},
        ${oldPrice ? parseInt(oldPrice, 10) : null}, ${imageUrl},
        ${category || "tech"}, ${badge || null}, 999, TRUE
      )
      RETURNING id, name, price_fcfa, compare_at_price_fcfa, image_url, category, badge, created_at
    `;

    return new Response(
      JSON.stringify({ message: "Produit publié avec succès", product }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Erreur serveur", details: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
