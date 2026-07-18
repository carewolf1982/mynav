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
  const { newPwd } = await request.json();
  const db = env.DB;
  await db.prepare("UPDATE nav_config SET value=? WHERE key='admin_pwd'").bind(newPwd).run();
  return new Response(JSON.stringify({ code: 0, msg: "密码修改成功" }), { headers: { "Content-Type": "application/json" } });
}