import { NextRequest } from "next/server";

export function getIp(
  req: NextRequest,
): string {
  // https://github.com/mastercactapus/caddy2-proxyprotocol
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return ip || '127.0.0.1'; // 确保默认值
}
