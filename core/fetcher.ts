import { httpClient, httpClientInstance } from './http-client';
import {
  PostResponse,
  CreatePostRequest,
  UpdatePostRequest,
  PatchPostRequest,
} from './models/api.model';

/**
 * 현 시점의 변경 가능성
 * - url, endpoint가 변경됐을 때 각 메소드 내부 수정
 * - http 요청 로직이 변경될 경우 각 메소드 내부 수정
 * - 공통 에러 처리가 변경되면 각각 수정해야함
 * - 인증 헤더가 추가되면 각각 추가해야함
 */

type ApiService = typeof apiService;

export const apiService = {
  // posts
  posts: async (): Promise<PostResponse[]> => {
    const res = await httpClientInstance.get<PostResponse[]>(`/posts`);
    return res;
  },
  postById: async (id: number): Promise<PostResponse> => {
    const res = await httpClientInstance.get<PostResponse>(`/posts/${id}`);
    return res;
  },
  createPost: async (post: CreatePostRequest): Promise<PostResponse> => {
    const res = await httpClientInstance.post<PostResponse>(`/posts`, post);
    return res;
  },
  updatePost: async (postId: number, post: UpdatePostRequest): Promise<PostResponse> => {
    const res = await httpClientInstance.put<PostResponse>(`/posts/${postId}`, post);
    return res;
  },
  patchPost: async (postId: number, post: PatchPostRequest): Promise<PostResponse> => {
    const res = await httpClientInstance.patch<PostResponse>(`/posts/${postId}`, post);
    return res;
  },
  deletePost: async (postId: number) => {
    await httpClientInstance.delete(`/posts/${postId}`);
  },

  // comments
  // comments: async (postId: number) => {
  //     const res = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  //     if (!res.ok) {
  //         throw new Error(`Failed to fetch comments for post with id ${postId}: ${res.statusText}`);
  //     }
  //     const data = await res.json();
  //     return data;
  // },
  // comment: async (commentId: number) => {
  //     const res = httpClient.get(`${BASE_URL}/comments/${commentId}`);
  //     return res;
  // }
};
