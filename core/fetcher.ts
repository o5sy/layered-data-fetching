import { PostResponse, CreatePostRequest, UpdatePostRequest, PatchPostRequest } from "./models/api.model";

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const apiFetcher = {
    // posts
    posts: async (): Promise<PostResponse[]> => {
        const res = await fetch(`${BASE_URL}/posts`);
        if (!res.ok) {
            throw new Error(`Failed to fetch posts: ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    },
    postById: async (id: number): Promise<PostResponse> => {
        const res = await fetch(`${BASE_URL}/posts/${id}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch post with id ${id}: ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    },
    createPost: async (post: CreatePostRequest): Promise<PostResponse> => {
        const res = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(post)
        });
        if (!res.ok) {
            throw new Error(`Failed to create post: ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    },
    updatePost: async (postId: number, post: UpdatePostRequest): Promise<PostResponse> => {
        const res = await fetch(`${BASE_URL}/posts/${postId}`, {
            method:'PUT',
            headers: {
                'Content-Type':'application/json; charset=UTF-8'
            },
            body: JSON.stringify(post)
        });
        if (!res.ok) {
            throw new Error(`Failed to update post with id ${postId}: ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    },
    patchPost: async (postId: number, post: PatchPostRequest): Promise<PostResponse> => {
        const res = await fetch(`${BASE_URL}/posts/${postId}`,{
            method:'PATCH',
            headers: {
                'Content-Type':'application/json; charset=UTF-8'
            },
            body: JSON.stringify(post)
        })
        if (!res.ok) {
            throw new Error(`Failed to patch post with id ${postId}: ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    },
    deletePost: async (postId: number) => {
        const res = await fetch(`${BASE_URL}/posts/${postId}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            throw new Error(`Failed to delete post with id ${postId}: ${res.statusText}`);
        }
    },

    // comments
    comments: async (postId: number) => {
        const res = await fetch(`${BASE_URL}/posts/${postId}/comments`);
        if (!res.ok) {
            throw new Error(`Failed to fetch comments for post with id ${postId}: ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    },
    // ... 다른 엔드포인트들도 여기에 추가
}