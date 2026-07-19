export const json = (data, status = 200) => new Response(
  JSON.stringify(data),
  { status, headers: { "Content-Type": "application/json" } }
);

export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
};

export const checkAuth = async (request, env) => {
  const storedHash = (await env.DB.prepare("SELECT value FROM nav_config WHERE key='admin_pwd'").first())?.value || await hashPassword('123456');
  const auth = request.headers.get("Authorization");
  if (!auth) {
    return json({ code: 403, msg: "未授权" }, 403);
  }
  const pwd = auth.replace('Bearer ', '');
  const inputHash = await hashPassword(pwd);
  if (inputHash !== storedHash) {
    return json({ code: 403, msg: "密码错误" }, 403);
  }
};
