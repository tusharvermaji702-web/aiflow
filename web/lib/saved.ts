const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type SavedItem = {
  id: number;
  item_type: "tool" | "workflow";
  item_slug: string;
  item_name: string;
};

async function authedRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export function fetchSavedItems(token: string, itemType?: "tool" | "workflow") {
  const qs = itemType ? `?item_type=${itemType}` : "";
  return authedRequest<SavedItem[]>(`/saved${qs}`, token);
}

export function saveItem(
  token: string,
  item: { item_type: "tool" | "workflow"; item_slug: string; item_name: string }
) {
  return authedRequest<SavedItem>("/saved", token, {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export function unsaveItem(token: string, itemType: string, itemSlug: string) {
  return authedRequest<{ message: string }>(`/saved/${itemType}/${itemSlug}`, token, {
    method: "DELETE",
  });
}
