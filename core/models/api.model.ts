interface PostResponse {
    id: number;
    userId: number;
    title: string;
    body: string;
}

interface PostInput {
    userId: number;
    title: string;
    body: string;
}

type CreatePostRequest = PostInput;

type UpdatePostRequest = PostInput;

type PatchPostRequest = Partial<PostInput>;

export type { PostResponse, CreatePostRequest, UpdatePostRequest, PatchPostRequest };