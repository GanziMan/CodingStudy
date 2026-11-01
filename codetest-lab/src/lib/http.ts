import { getProblem } from "./problems";

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function problemFromParams(params: Promise<{ id: string }>) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n)) return null;
  return (await getProblem(n)) ?? null;
}

export async function readCode(req: Request): Promise<string | null> {
  const body = (await req.json().catch(() => null)) as { code?: unknown } | null;
  return typeof body?.code === "string" && body.code.length <= 50_000 ? body.code : null;
}
