const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type ApiTool = {
  id: number;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  pricing: string;
  tags: string[];
  pros: string[];
  cons: string[];
  rating: number;
  website: string;
};

export type ApiCategory = {
  name: string;
  count: number;
};

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  return res.json();
}

export function fetchTools(params?: { category?: string; q?: string }): Promise<ApiTool[]> {
  const search = new URLSearchParams();
  if (params?.category && params.category !== "All") search.set("category", params.category);
  if (params?.q) search.set("q", params.q);
  const qs = search.toString();
  return request<ApiTool[]>(`/tools${qs ? `?${qs}` : ""}`);
}

export function fetchTool(slug: string): Promise<ApiTool> {
  return request<ApiTool>(`/tools/${slug}`);
}

export function fetchCategories(): Promise<ApiCategory[]> {
  return request<ApiCategory[]>("/categories");
}

export async function runToolkit(
  endpoint: "grammar" | "summarize" | "explain-code",
  text: string
): Promise<string> {
  const res = await fetch(`${API_URL}/toolkit/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail = typeof data.detail === "string" ? data.detail : "Something went wrong.";
    throw new Error(detail);
  }

  return data.result as string;
}

export type WorkflowStepResult = { title: string; output: string };

export async function runWorkflow(slug: string, text: string): Promise<WorkflowStepResult[]> {
  const res = await fetch(`${API_URL}/workflows/${slug}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail = typeof data.detail === "string" ? data.detail : "Something went wrong.";
    throw new Error(detail);
  }

  return data.steps as WorkflowStepResult[];
}
