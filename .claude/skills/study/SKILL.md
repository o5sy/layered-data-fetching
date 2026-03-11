---
name: study
description: >
  API 추상화 3계층 구조(ApiClient → Repository/Service → Component)를 학습하기 위한 데모 프로젝트 가이드 스킬.
  사용자가 "layered-data-fetching 공부", "API 추상화 데모", "fetcher 구현", "외부 API 모델과 클라이언트 모델 분리",
  "Repository 패턴 실습", "core/examples 폴더 구조 잡기" 등을 언급할 때 반드시 이 스킬을 사용하세요.
  순수 TypeScript + fetch API 기반으로 직접 로직을 작성하며 공부하는 방식을 지원합니다.
---

# Layered Data Fetching — 공부 스킬

## 학습 목표

외부 API 모델과 클라이언트 도메인 모델을 분리하는 중간 계층을 직접 구현하며,
API 추상화의 핵심 흐름을 손으로 짜보는 것.

**측정 기준: 코드를 보고 "이게 왜 문제인지, 어떻게 고치면 되는지" 리뷰할 수 있는 수준**

- 처음엔 간단하게 시작
- 각 단계별로 직접 로직 작성 (라이브러리 의존 최소화)
- 나중에 클래스, React Query, Next.js 등으로 확장 가능한 구조

---

## 핵심 문제 의식

외부 모델이 UI 레이어까지 누수될 때 생기는 문제 두 가지:

### Problem 1 — useEffect 직접 fetch (초심자에게 자주 보이는 패턴)
```ts
// 컴포넌트가 API 구조에 직접 의존
useEffect(() => {
  fetch('/posts')
    .then(r => r.json())
    .then(data => setData(data.items)) // ← API 응답 구조가 바뀌면 여기도 바뀜
}, [])
```
문제: API 응답 구조 변경 → 컴포넌트 직접 수정 필요. 중복 fetch 로직 산재.

### Problem 2 — codegen 타입 누수 (실무 패턴) ← **데모 시작점**
```ts
// codegen이 생성한 타입을 컴포넌트 props가 직접 참조
import { GeneratedPostType } from '__generated__/types'

type Props = { post: GeneratedPostType } // ← API 스펙이 곧 UI 계약

function PostCard({ post }: Props) {
  return <h2>{post.title}</h2> // API 필드명에 직접 의존
}
```
문제: API 스펙 변경 → tsc 에러 → GeneratedPostType을 쓰는 **모든 컴포넌트** 수정 필요.
중간 계층(변환 함수)이 없으면 codegen이 있어도 변경에 취약한 구조는 동일.

**두 문제의 공통 원인: 외부 모델이 UI 레이어까지 누수됨**

---

## 프로젝트 구조

```
layered-data-fetching/
├── core/                        # 순수 TS, 프레임워크 무관한 핵심 계층
│   ├── fetcher.ts               # fetch 래퍼 (baseURL, 공통 에러 처리)
│   ├── models/                  # 클라이언트 도메인 타입
│   │   └── post.ts              # ApiPost(외부) vs Post(내부) + toPost 변환함수
│   └── services/                # 객체 리터럴 기반 service (API 호출 + 모델 변환)
│       └── postService.ts
└── examples/
    └── react/
        ├── before/              # 문제 있는 패턴 (Before)
        │   └── PostList.tsx     # Problem 2: codegen 타입 직접 노출
        ├── after/               # 중간 계층 적용 후 (After)
        │   └── PostList.tsx
        ├── hooks/
        │   └── usePost.ts
        └── components/
            └── PostCard.tsx
```

> 나중에 `examples/next-app-router/`, `examples/next-pages-router/` 등으로 확장 예정

---

## 공부 단계 (Phase)

### Phase 0 — Before 코드 작성 ← **시작점**

**목표: 문제를 먼저 눈으로 확인하고, 뭘 해결하는지 체감하기**

`examples/react/before/PostList.tsx` 작성:
- JSONPlaceholder API 타입을 그대로 props로 받는 컴포넌트
- codegen 타입 누수 패턴을 JSONPlaceholder로 시뮬레이션

```ts
// before/PostList.tsx — 외부 API 타입이 컴포넌트까지 누수된 구조
interface ApiPost {       // ← codegen이 생성했다고 가정
  userId: number
  id: number
  title: string
  body: string
}

// API 타입이 곧 props 타입 — 중간 계층 없음
function PostCard({ post }: { post: ApiPost }) {
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.body}</p>        {/* API 필드명에 직접 의존 */}
      <small>by user {post.userId}</small>
    </div>
  )
}
```

**Before를 다 짠 후 스스로 물어볼 것:**
- API가 `body` → `content`로 바뀌면 몇 군데를 고쳐야 할까?
- `userId`를 `authorName`으로 표시하려면 어디서 처리해야 할까?
- 이 컴포넌트를 테스트하려면 API 응답 구조 전체를 알아야 할까?

---

### Phase 1 — core 구현

**순서대로 직접 작성:**

#### Step 1: `core/fetcher.ts`
- 역할: 모든 HTTP 요청의 공통 처리
- 포함할 것:
  - `baseURL` 설정 (JSONPlaceholder: `https://jsonplaceholder.typicode.com`)
  - `get`, `post`, `put`, `delete` 메서드
  - 응답 상태 코드 기반 에러 처리
  - 제네릭으로 응답 타입 지정 `<T>`

```ts
// 예시 시그니처
export const fetcher = {
  get: async <T>(path: string): Promise<T> => { ... },
  post: async <T>(path: string, body: unknown): Promise<T> => { ... },
}
```

#### Step 2: `core/models/post.ts`
- 역할: 외부 API 응답 타입 vs 클라이언트 도메인 타입 분리
- 포함할 것:
  - `ApiPost` — JSONPlaceholder 응답 그대로의 타입
  - `Post` — 클라이언트에서 사용할 도메인 모델 타입
  - `toPost(apiPost: ApiPost): Post` — 변환 함수 (여기서 필드명/구조 변환)

```ts
// 외부 API 응답 타입 (codegen이 생성한다고 가정)
export interface ApiPost {
  userId: number
  id: number
  title: string
  body: string
}

// 클라이언트 도메인 모델 — UI가 실제로 필요한 형태
export interface Post {
  id: string          // number → string 변환
  authorId: string    // userId → authorId 의미 명확화
  title: string
  summary: string     // body → summary로 가공
}

// 변환 함수 — 외부 변경이 여기서만 흡수됨
export const toPost = (apiPost: ApiPost): Post => ({ ... })
```

#### Step 3: `core/services/postService.ts`
- 역할: fetcher 호출 + 모델 변환을 담당하는 객체 리터럴
- 포함할 것:
  - `getAll(): Promise<Post[]>`
  - `getById(id: number): Promise<Post>`

```ts
export const postService = {
  getAll: async (): Promise<Post[]> => {
    const data = await fetcher.get<ApiPost[]>('/posts')
    return data.map(toPost)
  },
  getById: async (id: number): Promise<Post> => {
    const data = await fetcher.get<ApiPost>(`/posts/${id}`)
    return toPost(data)
  },
}
```

---

### Phase 2 — examples/react After 코드

**목표: core를 붙여서 Before와 비교**

- `usePost.ts`: `useState + useEffect`로 postService 호출
- `after/PostList.tsx`: Post(클라이언트 모델)만 아는 컴포넌트

```ts
// after/PostList.tsx — API 타입을 전혀 모름
function PostCard({ post }: { post: Post }) {  // ← 클라이언트 모델만 의존
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.summary}</p>     {/* 도메인 필드명 사용 */}
      <small>by {post.authorId}</small>
    </div>
  )
}
```

**After를 다 짠 후 비교할 것:**
- API가 `body` → `content`로 바뀌면? → `toPost` 함수 한 곳만 수정
- `userId`를 `authorName`으로 표시하려면? → service에서 처리 가능
- 컴포넌트 테스트 시 필요한 mock 데이터가 얼마나 단순해졌나?

> React Query는 이 단계 이후 별도 브랜치 or 폴더로 추가

---

### Phase 3 — 확장 고려사항 (나중에)

| 주제 | 방향 |
|------|------|
| 클래스 기반 Repository | 객체 리터럴 → class로 리팩터링 |
| 템플릿 메서드 패턴 | 공통 흐름 추상화 |
| React Query 도입 | service를 queryFn으로 연결 |
| Next.js App Router | Server Component에서 service 직접 호출 |
| Next.js Pages Router | getServerSideProps에서 service 호출 |
| 에러 처리 고도화 | ApiError 클래스, 인터셉터 패턴 |
| MSW 목킹 | 테스트 환경 구성 |

---

## 가이드 원칙

1. **직접 짜기 우선** — 완성된 코드보다 단계별 질문과 힌트 제공
2. **작게 시작, 점진적 확장** — 한 번에 다 구현하지 말 것
3. **타입부터** — 구현 전 타입/인터페이스 먼저 정의
4. **변환 함수 명시** — 외부 모델 → 내부 모델 변환을 항상 명시적으로

---

## 사용할 외부 API

- **JSONPlaceholder**: `https://jsonplaceholder.typicode.com`
- 주요 엔드포인트:
  - `GET /posts` — 전체 포스트
  - `GET /posts/:id` — 단일 포스트
  - `GET /users/:id` — 사용자 정보 (Phase 2+ 확장용)