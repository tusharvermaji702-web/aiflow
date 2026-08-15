const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type AuthUser = {
  id: number;
  email: string;
  username: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function authRequest(path: string, body: object): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.detail || "Something went wrong. Please try again.", res.status);
  }

  return data as AuthResponse;
}

export function registerUser(email: string, username: string, password: string) {
  return authRequest("/auth/register", { email, username, password });
}

export function loginUser(email: string, password: string) {
  return authRequest("/auth/login", { email, password });
}

export async function fetchCurrentUser(token: string): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new ApiError("Session expired. Please log in again.", res.status);
  }
  return res.json();
}
