export const json = (data, status = 200) => new Response(
  JSON.stringify(data),
  { status, headers: { "Content-Type": "application/json" } }
);

export const checkAuth = async (request, env) => {
  const adminPwd = (await env.DB.prepare("SELECT value FROM nav_config WHERE key='admin_pwd'").first())?.value || '123456';
  const auth = request.headers.get("Authorization");
  if (!auth || auth !== `Bearer ${adminPwd}`) {
    return json({ code: 403, msg: "密码错误" }, 403);
  }
};
