// netlify/functions/list-products.js

import { getDatabase } from "@netlify/database";

const STORE_SLUG = "eta-market";

export default async () => {
  try {
    const db = getDatabase();
    const products = await db.sql`
      SELECT p.id, p.name, p.description, p.price_fcfa, p.compare_at_price_fcfa,
             p.image_url, p.category, p.badge, p.created_at
      FROM products p
      JOIN stores s ON p.store_id = s.id
      WHERE s.slug = ${STORE_SLUG} AND p.is_active = TRUE
      ORDER BY p.created_at DESC
    `;

    return new Response(JSON.stringify({ products }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Erreur serveur", details: String(err), products: [] }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
