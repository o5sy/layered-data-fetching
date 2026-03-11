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

interface CreatePostRequest extends PostInput {}

interface UpdatePostRequest extends PostInput {}

interface PatchPostRequest extends Partial<PostInput> {}


export type { PostResponse, CreatePostRequest, UpdatePostRequest, PatchPostRequest };