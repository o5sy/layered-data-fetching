import { PostResponse, UpdatePostRequest, PatchPostRequest } from "./models/api.model";

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const apiFetcher = {
    // posts
    posts: () => {
        return fetch(`${BASE_URL}/posts`);
    },
    postById: (id: number) => {
        return fetch(`${BASE_URL}/posts/${id}`)
    },
    createPost: (post: PostResponse) => {
        return fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(post)
        })
    },
    updatePost: (postId: number, post: UpdatePostRequest) => {
        return fetch(`${BASE_URL}/posts/${postId}`, {
            method:'PUT',
            headers: {
                'Content-Type':'application/json; charset=UTF-8'
            },
            body: JSON.stringify(post)
        })
    },
    patchPost: (postId: number, post: PatchPostRequest) => {
        return fetch(`${BASE_URL}/posts/${postId}`,{
            method:'PATCH',
            headers: {
                'Content-Type':'application/json; charset=UTF-8'
            },
            body: JSON.stringify(post)
        })
    },
    deletePost: (postId: number) => {
        return fetch(`${BASE_URL}/posts/${postId}`, {
            method: 'DELETE',
        })
    },

    // comments
    comments: (postId: number) => {
        return fetch(`${BASE_URL}/posts/${postId}/comments`)
    }, 
    // ... 다른 엔드포인트들도 여기에 추가
}