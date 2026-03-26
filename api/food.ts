import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Missing or invalid 'query' parameter" });
      return;
    }

    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=${encodeURIComponent(query)}&json=1&page_size=12&fields=product_name,nutriments`,
    );

    if (!response.ok) {
      res.status(response.status).json({ error: "Failed to fetch data" });
      return;
    }

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: String(error) });
  }
}
