export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  createdAt: string;
}

export interface PlayerAccount {
  email: string;
}

class ScoreApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ScoreApiError";
  }
}

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
const SESSION_KEY = "retro-portfolio-player-session";
const AUTH_KEY = "retro-portfolio-auth-token";

function getStorage(): Storage | null {
  return typeof localStorage === "undefined" ? null : localStorage;
}

function getSessionId(): string {
  const storage = getStorage();
  const existing = storage?.getItem(SESSION_KEY);
  if (existing) return existing;

  const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  storage?.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

function getAuthHeaders(): Record<string, string> {
  const token = getStorage()?.getItem(AUTH_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new Error("Score API is not configured. Set EXPO_PUBLIC_API_URL.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...init?.headers,
    },
  });
  const body = (await response.json()) as { error?: string } & T;

  if (!response.ok) {
    throw new ScoreApiError(
      body.error ?? `Score API returned ${response.status}.`,
      response.status,
    );
  }

  return body;
}

export function getPlayerSessionId(): string {
  return getSessionId();
}

export function isScoreApiConfigured(): boolean {
  return Boolean(API_URL);
}

export function isSignedIn(): boolean {
  return Boolean(getStorage()?.getItem(AUTH_KEY));
}

export async function getCurrentAccount(): Promise<PlayerAccount | null> {
  if (!isSignedIn()) return null;
  try {
    return await request<PlayerAccount>("/api/auth/me");
  } catch (error) {
    if (error instanceof ScoreApiError && error.status === 401) {
      getStorage()?.removeItem(AUTH_KEY);
      getStorage()?.removeItem("retro-portfolio-account-email");
      return null;
    }
    throw error;
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await request<{ scores: LeaderboardEntry[] }>(
    "/api/scores?game=snake",
  );
  return response.scores;
}

export async function saveScore(playerName: string, score: number) {
  return request<{ score: LeaderboardEntry }>("/api/scores", {
    method: "POST",
    body: JSON.stringify({
      game: "snake",
      playerName,
      score,
      sessionId: getSessionId(),
    }),
  });
}

export async function requestEmailSignIn(email: string): Promise<void> {
  await request<{ message: string }>("/api/auth/magic-link", {
    method: "POST",
    body: JSON.stringify({ email, sessionId: getSessionId() }),
  });
}

export async function verifyEmailSignIn(token: string): Promise<PlayerAccount> {
  const response = await request<{ token: string; email: string }>("/api/auth/verify", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
  getStorage()?.setItem(AUTH_KEY, response.token);
  getStorage()?.setItem("retro-portfolio-account-email", response.email);
  return { email: response.email };
}

export async function getMyScores(): Promise<LeaderboardEntry[]> {
  const response = await request<{ scores: LeaderboardEntry[] }>(
    "/api/scores/mine",
  );
  return response.scores;
}
