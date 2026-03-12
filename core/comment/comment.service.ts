import { httpClientInstance } from '../http-client';

export const commentService = {
  commentsByPostId: async (postId: number) => {
    const res = await httpClientInstance.get(`/posts/${postId}/comments`);
    return res;
  },
  commentsById: async (comment: any) => {
    const res = await httpClientInstance.post(`/comments`, comment);
    return res;
  },
  commentById: async (commentId: number) => {
    const res = await httpClientInstance.get(`/comments/${commentId}`);
    return res;
  },
};
