const LOCAL_BASE = "http://localhost";

export function safeNextPath(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return null;
  }

  try {
    const url = new URL(value, LOCAL_BASE);
    if (url.origin !== LOCAL_BASE) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}
