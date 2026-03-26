import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { query } = req.query;

  const response = await fetch(
    `https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=${query}&json=1&page_size=12&fields=product_name,nutriments`,
  );

  const data = await response.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(data);
}
