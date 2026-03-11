# Before — 외부 API 타입이 컴포넌트까지 누수된 구조

## 생각해볼 시나리오

### 1. body → content로 API 필드명이 바뀌면?

#### 1. API 스펙 변경을 구조상으로 캐치할 수 없다.

변경이 프론트엔드 개발자에게 공유되지 않은 경우, 런타임 환경에서 잘못된 속성에 접근하면서 참조 오류가 발생할 수 있다.

이는 Code Gen 방식으로 해결할 수 있다. 아래 영상 참고.

[오늘도 여러분의 API는 안녕하신가요?: API First Design과 CodeGen 활용하기 | 인프콘2023](https://www.youtube.com/watch?v=mhGz8q-aOZ0)

#### 2. API 변경으로 인한 변경점이 여러 컴포넌트에 전파된다.

```ts
// ApiPost.body → ApiPost.content 로 변경됨
interface ApiPost {
  userId: number
  id: number
  title: string
  content: string  // ← 바뀜
}
```

`ApiPost`를 직접 참조하는 모든 곳에 tsc 에러가 퍼진다.

```
PostList.tsx:16  - Property 'body' does not exist on type 'ApiPost'
PostCard.tsx:8   - Property 'body' does not exist on type 'ApiPost'
SomeOtherPage.tsx:24 - Property 'body' does not exist on type 'ApiPost'
...
```

소규모 프로젝트라면 일일히 수정할 곳이 많지 않겠지만, ApiPost가 얼마나 사용될지 알 수 없는 상황에서 규모가 커지면 수정에 들어가는 리소스가 기하급수적으로 커질 수 있다.

---

### 2. userId를 사람 이름으로 표시하려면?

사람 이름 정보를 위해 추가 데이터 조회가 필요하다.

`PostCard`는 props를 받아 렌더링만 하는 뷰 컴포넌트라는 가정하에<br />
→ 네트워크 요청이 있는 `PostList`에서 유저 정보를 추가로 조회해서 내려줘야 한다.

```ts
// PostList에서 처리한다면...
const posts = await fetch('/posts').then(r => r.json())
const postsWithAuthor = await Promise.all(
  posts.map(async (post) => {
    const user = await fetch(`/users/${post.userId}`).then(r => r.json())
    return { ...post, authorName: user.name }
  })
)
```

추가 데이터 조회 및 데이터 변환 로직이 컴포넌트에 포함된다.<br />
코드는 길어지고, 변경 지점 파악이 어려워지며, 유지보수가 어려워지게 된다.

---

## 근본 원인 — `<PostList />`의 과도한 책임

현재 `PostList` 컴포넌트는 세 가지 역할을 동시에 수행한다.

| 책임 | 코드 |
|------|------|
| 네트워크 요청 | `fetch(...)` |
| 요청 상태 관리 | `useState(loading, error, posts)` |
| UI 렌더링 | `posts.map(<PostCard />)` |

역할이 섞이면 변경에 취약해진다.

- API URL이 바뀌면 → 컴포넌트 수정
- 로딩 UI가 바뀌면 → 컴포넌트 수정
- API 응답 구조가 바뀌면 → 컴포넌트 수정
- 데이터 변환 방식이 바뀌면 → 컴포넌트 수정

**하나의 컴포넌트를 수정해야 하는 이유가 4가지** → 단일 책임 원칙(SRP) 위반

각 책임을 분리해야한다.

<!-- 
```
fetch 로직    → fetcher.ts
모델 변환      → toPost() in models/post.ts
API 호출 조합  → postService.ts
상태 관리      → usePost.ts (hook)
렌더링         → PostList.tsx (순수 UI)
``` 
-->