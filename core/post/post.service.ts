import { httpClient, httpClientInstance } from '../http-client';
import {
  PostResponse,
  CreatePostRequest,
  UpdatePostRequest,
  PatchPostRequest,
} from '../models/api.model';

// 역할: 리소스별 요청 서비스
// 책임: 요청 메소드 관리
// ! 테스트할 경우 목서비스를 생성하기 위해 타입 필요
export const postService = {
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
};
