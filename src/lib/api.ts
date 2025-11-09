// @/lib/api.ts
// 개발 환경: Next.js 프록시 사용 (CORS 우회)
// 프로덕션: 직접 백엔드 호출
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '' // Next.js가 /api를 프록시로 처리
  : 'https://emojicon.kr';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`[API Request] ${options.method || 'GET'} ${url}`, options.body);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status}:`, errorText);
      throw new Error(`${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[API Response]`, data);
    return data;
  } catch (error) {
    console.error(`[API Error]`, error);
    throw error;
  }
}

export async function apiStartGame() {
  return fetchApi('/api/emoji/start', {
    method: 'POST',
  });
}

export async function apiPickEmoji({ emoji }: { emoji: string }) {
  return fetchApi('/api/emoji/pick', {
    method: 'POST',
    body: JSON.stringify({ emoji }),
  });
}

export async function apiRefreshEmojis({ run_id }: { run_id: string }) {
  return fetchApi('/api/emoji/refresh', {
    method: 'POST',
    body: JSON.stringify({ run_id }),
  });
}

export async function apiDeleteEmojisFromBasket() {
  return fetchApi('/api/emoji/delete', {
    method: 'DELETE',
  });
}

export async function apiFinishGame({ run_id }: { run_id: string }) {
  return fetchApi('/api/emoji/finish', {
    method: 'POST',
    body: JSON.stringify({ run_id }),
  });
}

export async function apiGetResult(share_id: string) {
  return fetchApi(`/api/emoji/${share_id}`, {
    method: 'GET',
  });
}