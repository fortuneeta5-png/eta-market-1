// netlify/functions/delete-product.js

import { getDatabase } from "@netlify/database";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Méthode non autorisée", { status: 405 });
  }

  try {
    const { productId } = await req.json();
    if (!productId) {
      return new Response(JSON.stringify({ error: "productId requis" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    const db = getDatabase();
    await db.sql`UPDATE products SET is_active = FALSE WHERE id = ${productId}`;

    return new Response(JSON.stringify({ message: "Produit supprimé" }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Erreur serveur", details: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
