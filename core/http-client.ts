import { RequestConfig } from './http.type';

// 역할: http 요청 팩토리
// 책임: http 요청을 위한 인터페이스를 제공한다.
export const httpClient = (baseUrl: string) => ({
  async get<T>(url: string) {
    return request<T>({ method: 'GET', url: `${baseUrl}${url}` });
  },
  async post<T>(url: string, body: any) {
    return request<T>({ method: 'POST', url: `${baseUrl}${url}`, body });
  },
  async put<T>(url: string, body: any) {
    return request<T>({ method: 'PUT', url: `${baseUrl}${url}`, body });
  },
  async patch<T>(url: string, body: any) {
    return request<T>({ method: 'PATCH', url: `${baseUrl}${url}`, body });
  },
  async delete<T>(url: string) {
    return request<T>({ method: 'DELETE', url: `${baseUrl}${url}` });
  },
});

// 역할: HTTP 요청 실행
// 책임: fetch 호출, 오류 처리, JSON 파싱
// !취약점 fetch 방식은 직접 수정만으로만 교체 가능 (axios, next/fetch로 변경 가능성이 있다면 어댑터 추가 고려)
async function request<T>(config: RequestConfig): Promise<T> {
  try {
    const res = await fetch(config.url, {
      method: config.method,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        ...config.headers,
      },
      body: config.body ? JSON.stringify(config.body) : undefined,
    });
    if (!res.ok) {
      throw new Error(`Request failed: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(`Request failed: ${error}`);
  }
}

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// 역할: HTTP 요청 인스턴스
// 책임: BASE_URL 바인딩, 인스턴스화
export const httpClientInstance = httpClient(BASE_URL);
