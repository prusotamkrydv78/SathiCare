// Fetch wrapper for the SathiCare API.
// - always sends credentials (httpOnly cookies)
// - on 401, tries one token refresh (queued so parallel callers wait together), then retries once

type Options = RequestInit & { skipRefresh?: boolean };

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    })
      .then((r) => r.ok)
      .catch(() => false)
      .finally(() => {
        setTimeout(() => (refreshPromise = null), 0);
      });
  }
  return refreshPromise;
}

export async function api<T = unknown>(path: string, options: Options = {}): Promise<T> {
  const { skipRefresh, ...init } = options;
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (res.status === 401 && !skipRefresh && !path.includes("/auth/")) {
    const refreshed = await tryRefresh();
    if (refreshed) return api<T>(path, { ...options, skipRefresh: true });
  }

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok) {
    const message =
      (payload as { message?: string } | null)?.message ?? `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return payload as T;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const get = <T>(path: string) => api<T>(path);
export const post = <T>(path: string, body?: unknown) =>
  api<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });
export const put = <T>(path: string, body?: unknown) =>
  api<T>(path, { method: "PUT", body: body === undefined ? undefined : JSON.stringify(body) });
export const del = <T>(path: string) => api<T>(path, { method: "DELETE" });
