export function readEnv(key: string, domain?: string[]) {
  const v = process.env[key];
  if (!v) throw new Error(`${key} is undefined`);
  if (domain && !domain.includes(v)) {
    throw new Error(`${key} (${v}) not in ${domain}`);
  }
  return v;
}
