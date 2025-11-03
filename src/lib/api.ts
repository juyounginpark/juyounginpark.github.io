const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
};

async function fetchApi<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    // API 에러 응답을 더 상세히 처리할 수 있습니다.
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    console.error(`API Error ${response.status}:`, errorData);
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  // 204 No Content 같이 body가 없는 성공 응답 처리
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/* =========================
 * API 함수들
 * ========================= */

export const apiStartGame = () => 
  fetchApi<{ run_id: string; seed: number; layout_seed: number; pool: string[] }>('/emoji/start', { method: 'POST' });

export const apiPickEmoji = (run_id: string, emoji: string) =>
  fetchApi<{ ok: boolean; order: number; remaining: number }>('/emoji/pick', {
    method: 'POST',
    body: { run_id, emoji }, // 명세서에 없지만 run_id는 필수일 것입니다.
  });

export const apiFinishGame = (run_id: string) =>
  fetchApi<{
    style: { plan: string; extroversion: string };
    emoji_con_url: string;
    lines: string[];
    top_emojis: string[];
    share_id: string;
  }>('/emoji/finish', {
    method: 'POST',
    body: { run_id }, // run_id 필요
  });

export const apiRefreshEmojis = (run_id: string) =>
  fetchApi<{ run_id: string; seed: number; layout_seed: number; pool: string[] }>('/emoji/refresh', {
    method: 'POST',
    body: { run_id }, // run_id 필요
  });

export const apiDeleteFromBasket = (run_id: string) =>
  fetchApi<{ ok: boolean }>('/emoji/delete', {
    method: 'DELETE',
    body: { run_id }, // run_id 필요
  });

export const apiGetSharedResult = (share_id: string) =>
  fetchApi<{ lines: string[]; top_emojis: string[] }>(`/emoji/${share_id}`);