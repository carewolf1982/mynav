import { json, checkAuth, hashPassword } from '../utils.js';

export async function onRequest(context) {
  const { request, env } = context;
  const { pathname } = new URL(request.url);
  const method = request.method;

  if (pathname === '/api/nav/list' && method === 'GET') {
    const [categories, links, stocks] = await Promise.all([
      env.DB.prepare("SELECT * FROM nav_category ORDER BY sort").all(),
      env.DB.prepare("SELECT * FROM nav_link ORDER BY sort").all(),
      env.DB.prepare("SELECT * FROM nav_stock ORDER BY sort").all()
    ]);
    return json({ code: 0, data: { categories: categories.results, links: links.results, stocks: stocks.results } });
  }

  if (pathname === '/api/nav/login' && method === 'POST') {
    const storedHash = (await env.DB.prepare("SELECT value FROM nav_config WHERE key='admin_pwd'").first())?.value || await hashPassword('123456');
    const { pwd } = await request.json();
    const inputHash = await hashPassword(pwd);
    return inputHash === storedHash ? json({ code: 0, msg: "登录成功" }) : json({ code: 403, msg: "密码错误" }, 403);
  }

  const authErr = await checkAuth(request, env);
  if (authErr) return authErr;

  const db = env.DB;

  if (pathname === '/api/nav/pwd' && method === 'POST') {
    const { newPwd } = await request.json();
    const hashedPwd = await hashPassword(newPwd);
    await db.prepare("UPDATE nav_config SET value=? WHERE key='admin_pwd'").bind(hashedPwd).run();
    return json({ code: 0, msg: "密码修改成功" });
  }

  if (pathname === '/api/nav/category') {
    if (method === 'POST') {
      const { name, sort } = await request.json();
      await db.prepare("INSERT INTO nav_category(name,sort) VALUES(?,?)").bind(name, sort || 0).run();
      return json({ code: 0, msg: "分类新增成功" });
    }
    if (method === 'PUT') {
      const { id, name, sort } = await request.json();
      await db.prepare("UPDATE nav_category SET name=?,sort=? WHERE id=?").bind(name, sort || 0, id).run();
      return json({ code: 0, msg: "分类修改成功" });
    }
    if (method === 'DELETE') {
      const id = new URL(request.url).searchParams.get("id");
      await db.prepare("DELETE FROM nav_category WHERE id=?").bind(id).run();
      await db.prepare("DELETE FROM nav_link WHERE category_id=?").bind(id).run();
      return json({ code: 0, msg: "分类删除成功" });
    }
  }

  if (pathname === '/api/nav/link') {
    if (method === 'POST') {
      const { category_id, title, url, icon, icon_color, desc, sort } = await request.json();
      await db.prepare(`INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)`)
        .bind(category_id, title, url, icon, icon_color, desc, sort || 0).run();
      return json({ code: 0, msg: "新增成功" });
    }
    if (method === 'PUT') {
      const { id, category_id, title, url, icon, icon_color, desc, sort } = await request.json();
      await db.prepare(`UPDATE nav_link SET category_id=?,title=?,url=?,icon=?,icon_color=?,desc=?,sort=? WHERE id=?`)
        .bind(category_id, title, url, icon, icon_color, desc, sort || 0, id).run();
      return json({ code: 0, msg: "修改成功" });
    }
    if (method === 'DELETE') {
      const id = new URL(request.url).searchParams.get("id");
      await db.prepare("DELETE FROM nav_link WHERE id=?").bind(id).run();
      return json({ code: 0, msg: "删除成功" });
    }
  }

  if (pathname === '/api/nav/stock') {
    if (method === 'POST') {
      const { code, name, sort } = await request.json();
      await db.prepare("INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)").bind(code, name, sort || 0).run();
      return json({ code: 0, msg: "股票新增成功" });
    }
    if (method === 'PUT') {
      const { id, code, name, sort } = await request.json();
      await db.prepare("UPDATE nav_stock SET code=?,name=?,sort=? WHERE id=?").bind(code, name, sort || 0, id).run();
      return json({ code: 0, msg: "股票修改成功" });
    }
    if (method === 'DELETE') {
      const id = new URL(request.url).searchParams.get("id");
      await db.prepare("DELETE FROM nav_stock WHERE id=?").bind(id).run();
      return json({ code: 0, msg: "股票删除成功" });
    }
  }

  return json({ code: 404, msg: "接口不存在" }, 404);
}
