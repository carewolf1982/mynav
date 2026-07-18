const checkAuth = async (request, env) => {
  const db = env.DB;
  const adminPwd = (await db.prepare("SELECT value FROM nav_config WHERE key='admin_pwd'").first())?.value || '123456';
  const auth = request.headers.get("Authorization");
  if (!auth || auth !== `Bearer ${adminPwd}`) {
    return new Response(JSON.stringify({ code: 403, msg: "密码错误" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }
};

export async function onRequestPost(context) {
  const { request, env } = context;
  const authErr = await checkAuth(request, env); if (authErr) return authErr;
  const { code, name, sort } = await request.json();
  const db = env.DB;
  await db.prepare("INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)").bind(code, name, sort || 0).run();
  return new Response(JSON.stringify({ code: 0, msg: "股票新增成功" }), { headers: { "Content-Type": "application/json" } });
}

export async function onRequestPut(context) {
  const { request, env } = context;
  const authErr = await checkAuth(request, env); if (authErr) return authErr;
  const { id, code, name, sort } = await request.json();
  const db = env.DB;
  await db.prepare("UPDATE nav_stock SET code=?,name=?,sort=? WHERE id=?").bind(code, name, sort || 0, id).run();
  return new Response(JSON.stringify({ code: 0, msg: "股票修改成功" }), { headers: { "Content-Type": "application/json" } });
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  const authErr = await checkAuth(request, env); if (authErr) return authErr;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const db = env.DB;
  await db.prepare("DELETE FROM nav_stock WHERE id=?").bind(id).run();
  return new Response(JSON.stringify({ code: 0, msg: "股票删除成功" }), { headers: { "Content-Type": "application/json" } });
}