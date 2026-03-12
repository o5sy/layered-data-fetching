interface CommentResponse {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export type { CommentResponse };
