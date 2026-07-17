export default async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const db = env.DB;
  const adminPwd = (await db.prepare("SELECT value FROM nav_config WHERE key='admin_pwd'").first())?.value || '123456';

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization"
  };

  if (request.method === "OPTIONS") return new Response(null, { headers });

  if (path === "/api/nav/login" && request.method === "POST") {
    const { pwd } = await request.json();
    if (pwd === adminPwd) {
      return new Response(JSON.stringify({ code: 0, msg: "登录成功" }), { headers });
    }
    return new Response(JSON.stringify({ code: 403, msg: "密码错误" }), { status: 403, headers });
  }

  const checkAuth = () => {
    const auth = request.headers.get("Authorization");
    if (!auth || auth !== `Bearer ${adminPwd}`) {
      return new Response(JSON.stringify({ code: 403, msg: "密码错误" }), { status: 403, headers });
    }
  };

  if (path === "/api/nav/list" && request.method === "GET") {
    const categories = await db.prepare("SELECT * FROM nav_category ORDER BY sort").all();
    const links = await db.prepare("SELECT * FROM nav_link ORDER BY sort").all();
    const stocks = await db.prepare("SELECT * FROM nav_stock ORDER BY sort").all();
    return new Response(JSON.stringify({
      code: 0,
      data: { categories: categories.results, links: links.results, stocks: stocks.results }
    }), { headers });
  }

  if (path === "/api/nav/link" && request.method === "POST") {
    const authErr = checkAuth(); if (authErr) return authErr;
    const { category_id, title, url, icon, desc, sort } = await request.json();
    await db.prepare(`INSERT INTO nav_link(category_id,title,url,icon,desc,sort) VALUES(?,?,?,?,?,?)`)
      .bind(category_id, title, url, icon, desc, sort || 0).run();
    return new Response(JSON.stringify({ code: 0, msg: "新增成功" }), { headers });
  }

  if (path === "/api/nav/link" && request.method === "PUT") {
    const authErr = checkAuth(); if (authErr) return authErr;
    const { id, category_id, title, url, icon, desc, sort } = await request.json();
    await db.prepare(`UPDATE nav_link SET category_id=?,title=?,url=?,icon=?,desc=?,sort=? WHERE id=?`)
      .bind(category_id, title, url, icon, desc, sort || 0, id).run();
    return new Response(JSON.stringify({ code: 0, msg: "修改成功" }), { headers });
  }

  if (path === "/api/nav/link" && request.method === "DELETE") {
    const authErr = checkAuth(); if (authErr) return authErr;
    const id = url.searchParams.get("id");
    await db.prepare("DELETE FROM nav_link WHERE id=?").bind(id).run();
    return new Response(JSON.stringify({ code: 0, msg: "删除成功" }), { headers });
  }

  if (path === "/api/nav/category" && request.method === "POST") {
    const authErr = checkAuth(); if (authErr) return authErr;
    const { name, sort } = await request.json();
    await db.prepare("INSERT INTO nav_category(name,sort) VALUES(?,?)").bind(name, sort || 0).run();
    return new Response(JSON.stringify({ code: 0, msg: "分类新增成功" }), { headers });
  }

  if (path === "/api/nav/category" && request.method === "PUT") {
    const authErr = checkAuth(); if (authErr) return authErr;
    const { id, name, sort } = await request.json();
    await db.prepare("UPDATE nav_category SET name=?,sort=? WHERE id=?").bind(name, sort || 0, id).run();
    return new Response(JSON.stringify({ code: 0, msg: "分类修改成功" }), { headers });
  }

  if (path === "/api/nav/category" && request.method === "DELETE") {
    const authErr = checkAuth(); if (authErr) return authErr;
    const id = url.searchParams.get("id");
    await db.prepare("DELETE FROM nav_category WHERE id=?").bind(id).run();
    await db.prepare("DELETE FROM nav_link WHERE category_id=?").bind(id).run();
    return new Response(JSON.stringify({ code: 0, msg: "分类删除成功" }), { headers });
  }

  if (path === "/api/nav/stock" && request.method === "POST") {
    const authErr = checkAuth(); if (authErr) return authErr;
    const { code, name, sort } = await request.json();
    await db.prepare("INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)").bind(code, name, sort || 0).run();
    return new Response(JSON.stringify({ code: 0, msg: "股票新增成功" }), { headers });
  }

  if (path === "/api/nav/stock" && request.method === "PUT") {
    const authErr = checkAuth(); if (authErr) return authErr;
    const { id, code, name, sort } = await request.json();
    await db.prepare("UPDATE nav_stock SET code=?,name=?,sort=? WHERE id=?").bind(code, name, sort || 0, id).run();
    return new Response(JSON.stringify({ code: 0, msg: "股票修改成功" }), { headers });
  }

  if (path === "/api/nav/stock" && request.method === "DELETE") {
    const authErr = checkAuth(); if (authErr) return authErr;
    const id = url.searchParams.get("id");
    await db.prepare("DELETE FROM nav_stock WHERE id=?").bind(id).run();
    return new Response(JSON.stringify({ code: 0, msg: "股票删除成功" }), { headers });
  }

  if (path === "/api/nav/pwd" && request.method === "POST") {
    const authErr = checkAuth(); if (authErr) return authErr;
    const { newPwd } = await request.json();
    await db.prepare("UPDATE nav_config SET value=? WHERE key='admin_pwd'").bind(newPwd).run();
    return new Response(JSON.stringify({ code: 0, msg: "密码修改成功" }), { headers });
  }

  return new Response(JSON.stringify({ code: 404, msg: "接口不存在" }), { status: 404, headers });
}