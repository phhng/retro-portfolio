const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
const AUTH_KEY = "retro-portfolio-auth-token";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getStorage(): Storage | null {
  return typeof localStorage === "undefined" ? null : localStorage;
}

export function isApiConfigured(): boolean {
  return Boolean(API_URL);
}

export function getApiAuthToken(): string | null {
  return getStorage()?.getItem(AUTH_KEY) ?? null;
}

export function setApiAuthToken(token: string): void {
  getStorage()?.setItem(AUTH_KEY, token);
}

export function clearApiAuthToken(): void {
  getStorage()?.removeItem(AUTH_KEY);
}

export async function callApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  if (!API_URL) {
    throw new Error("API is not configured. Set EXPO_PUBLIC_API_URL.");
  }

  const token = getApiAuthToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  let body: { error?: string } & T;
  try {
    body = (await response.json()) as { error?: string } & T;
  } catch (error) {
    if (!response.ok) {
      throw new ApiError(`API returned ${response.status}.`, response.status);
    }
    throw error;
  }

  if (!response.ok) {
    throw new ApiError(
      body.error ?? `API returned ${response.status}.`,
      response.status,
    );
  }

  return body;
}
