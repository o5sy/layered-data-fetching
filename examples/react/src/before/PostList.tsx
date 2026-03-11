import { useState, useEffect } from 'react'

// codegen이 생성했다고 가정 — 외부 API 스펙 그대로의 타입
interface ApiPost {
  userId: number
  id: number
  title: string
  body: string
}

// API 타입이 곧 props 타입 — 중간 계층 없음
function PostCard({ post }: { post: ApiPost }) {
  return (
    <div style={{ border: '1px solid #ccc', margin: '8px 0', padding: '12px' }}>
      <h2 style={{ fontSize: '16px', margin: '0 0 8px' }}>{post.title}</h2>
      <p style={{ margin: '0 0 8px', color: '#555' }}>{post.body}</p>
      <small style={{ color: '#999' }}>by user {post.userId}</small>
    </div>
  )
}

function PostList() {
const [posts, setPosts] = useState<ApiPost[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        const posts = await response.json();
        setPosts(posts);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>
  if (!posts || posts.length === 0) return null;
  return (
    <div>
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  )
}

export default function PostSection() {
  return (
    <div>
      <h1>Posts (Before)</h1>
      <PostList />
    </div>
  )
}