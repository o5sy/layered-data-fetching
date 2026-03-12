import { RequestConfig } from './http.type';

// http 요청 래퍼 객체
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

// 내부 구현 캡슐화
// ! fetch 방식은 직접 수정만으로만 교체 가능
// 공통 요청 로직 (에러 처리, 인증 헤더, 타임아웃, 로깅 등)
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

// 인스턴스화
const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const httpClientInstance = httpClient(BASE_URL);
