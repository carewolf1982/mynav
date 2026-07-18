export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  const adminPwd = (await db.prepare("SELECT value FROM nav_config WHERE key='admin_pwd'").first())?.value || '123456';
  const { pwd } = await request.json();
  if (pwd === adminPwd) {
    return new Response(JSON.stringify({ code: 0, msg: "登录成功" }), { headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ code: 403, msg: "密码错误" }), { status: 403, headers: { "Content-Type": "application/json" } });
}