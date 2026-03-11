interface PostResponse {
    id: number;
    userId: number;
    title: string;
    body: string;
}

interface UpdatePostRequest {
    userId: number;
    title: string;
    body: string;
}

type PatchPostRequest = Partial<UpdatePostRequest>;

export type { PostResponse, UpdatePostRequest, PatchPostRequest };