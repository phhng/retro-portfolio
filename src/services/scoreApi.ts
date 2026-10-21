import {
  ApiError,
  callApi,
  clearApiAuthToken,
  getApiAuthToken,
  isApiConfigured,
  setApiAuthToken,
} from "./api";

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  createdAt: string;
}

export interface PlayerAccount {
  email: string;
}

export type ScoreGame = "snake" | "minesweeper";

const SESSION_KEY = "retro-portfolio-player-session";

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

export function getPlayerSessionId(): string {
  return getSessionId();
}

export function isScoreApiConfigured(): boolean {
  return isApiConfigured();
}

export function isSignedIn(): boolean {
  return Boolean(getApiAuthToken());
}

export async function getCurrentAccount(): Promise<PlayerAccount | null> {
  if (!isSignedIn()) return null;
  try {
    return await callApi<PlayerAccount>("/api/auth/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      clearApiAuthToken();
      getStorage()?.removeItem("retro-portfolio-account-email");
      return null;
    }
    throw error;
  }
}

export async function getLeaderboard(
  game: ScoreGame = "snake",
): Promise<LeaderboardEntry[]> {
  const response = await callApi<{ scores: LeaderboardEntry[] }>(
    `/api/scores?game=${game}`,
  );
  return response.scores;
}

export async function saveScore(
  playerName: string,
  score: number,
  game: ScoreGame = "snake",
) {
  return callApi<{ score: LeaderboardEntry }>("/api/scores", {
    method: "POST",
    body: JSON.stringify({
      game,
      playerName,
      score,
      sessionId: getSessionId(),
    }),
  });
}

export async function requestEmailSignIn(email: string): Promise<void> {
  await callApi<{ message: string }>("/api/auth/magic-link", {
    method: "POST",
    body: JSON.stringify({ email, sessionId: getSessionId() }),
  });
}

export async function verifyEmailSignIn(token: string): Promise<PlayerAccount> {
  const response = await callApi<{ token: string; email: string }>(
    "/api/auth/verify",
    {
      method: "POST",
      body: JSON.stringify({ token }),
    },
  );
  setApiAuthToken(response.token);
  getStorage()?.setItem("retro-portfolio-account-email", response.email);
  return { email: response.email };
}

export async function getMyScores(): Promise<LeaderboardEntry[]> {
  const response = await callApi<{ scores: LeaderboardEntry[] }>(
    "/api/scores/mine?game=snake",
  );
  return response.scores;
}
