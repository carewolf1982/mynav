export async function onRequestGet(context) {
  const { env } = context;
  const db = env.DB;
  const categories = await db.prepare("SELECT * FROM nav_category ORDER BY sort").all();
  const links = await db.prepare("SELECT * FROM nav_link ORDER BY sort").all();
  const stocks = await db.prepare("SELECT * FROM nav_stock ORDER BY sort").all();
  return new Response(JSON.stringify({
    code: 0,
    data: { categories: categories.results, links: links.results, stocks: stocks.results }
  }), { headers: { "Content-Type": "application/json" } });
}