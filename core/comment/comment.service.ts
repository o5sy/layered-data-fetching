import { httpClientInstance } from '../http-client';
import { CommentResponse } from './comment.type';

export const commentService = {
  commentsByPostId: async (postId: number): Promise<CommentResponse[]> => {
    const res = await httpClientInstance.get<CommentResponse[]>(`/posts/${postId}/comments`);
    return res;
  },
  commentById: async (commentId: number): Promise<CommentResponse> => {
    const res = await httpClientInstance.get<CommentResponse>(`/comments/${commentId}`);
    return res;
  },
};
