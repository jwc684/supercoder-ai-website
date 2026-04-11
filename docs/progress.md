# 슈퍼코더 AI Interviewer — 구현 진행 로그

> 이 문서는 각 Phase 의 완료일, 계획 대비 변경점, 컨펌 여부를 영속적으로 기록한다.
> 마스터 플랜: `/Users/jay/.claude/plans/quirky-launching-pearl.md`
> 원본 기획문서: `docs/AI_Interviewer_기획문서_v2.md`

---

## 📊 전체 상황판

| Phase | 내용 | 상태 | 컨펌 |
|---|---|---|---|
| 0 | 기반 구축 (Next.js + Supabase + Prisma + 레이아웃) | ✅ 완료 (2026-04-11) | 🟢 컨펌 (push 완료) |
| 1 | 랜딩 페이지 12 섹션 | ✅ 완료 (2026-04-11) | 🟢 컨펌 (push 완료) |
| 2 | 도입 문의 + 소개서 다운로드 (공개 폼) | ✅ 완료 (2026-04-11) | 🟢 컨펌 (push 완료) |
| 3 | 관리자 인증 + 대시보드 | ✅ 완료 (2026-04-11) | 🟢 컨펌 (로그인 테스트 + push 완료) |
| 4 | 관리자 — 문의/다운로드 리스트 | ✅ 완료 (2026-04-11) | 🟢 컨펌 (push 완료) |
| 5 | 관리자 — 블로그 CRUD + Tiptap + Storage | 🟡 진행 중 (Task 5-1 완료) | — |
| 6 | 공개 블로그 (목록 + 상세) | ⏳ 대기 | — |
| 7 | 관리자 약관 + 공개 약관 페이지 | ⏳ 대기 | — |
| 8 | Trial 플레이스홀더 + SEO + 마무리 | ⏳ 대기 | — |
| 9 | Vercel 배포 | ⏳ 대기 | — |

### 🔗 GitHub 리모트
- Repo: https://github.com/jwc684/supercoder-ai-website
- 최신 푸시: `6ea8f48 Phase 4: 관리자 문의/다운로드 리스트 + CSV 내보내기`
- Phase 5 는 진행 중 (로컬, 미커밋)

---

## ✅ Phase 0 — 기반 구축

**완료일**: 2026-04-11
**목표**: 프로젝트 골격 + Supabase/Prisma 연결 + 디자인 토큰 + 공통 레이아웃.

### 완료한 작업

- [x] Next.js 16.2 (App Router, TypeScript, Turbopack)
- [x] Tailwind CSS v4 + `@theme` 브랜드 토큰 (기획문서 9.1 팔레트)
- [x] Pretendard Variable 폰트 (CDN)
- [x] `lib/supabase/{client,server,middleware}.ts` — `@supabase/ssr` 패턴
- [x] `proxy.ts` — `/admin/*` 인증 보호 (Next.js 16 신규 컨벤션)
- [x] `prisma/schema.prisma` — 5 모델 (AdminUser/BlogPost/Terms/Inquiry/Download)
- [x] `prisma migrate dev --name init` — Supabase Postgres 에 5 테이블 생성 성공
- [x] `components/layout/Header.tsx`, `Footer.tsx` — 공통 레이아웃
- [x] `components/layout/LogoMark.tsx` — 인라인 SVG 로고 컴포넌트
- [x] `app/page.tsx` — Phase 0 체크리스트 플레이스홀더
- [x] `app/icon.svg` + `app/favicon.ico` — 브라우저 탭 아이콘 (멀티사이즈 ICO)
- [x] Maki People 컨테이너 룰 적용 (`wp-container`, 1296px @ 1440vw)

### 계획 대비 변경점

| # | 원안 | 실제 적용 | 이유 |
|---|---|---|---|
| 1 | Prisma v7 | **Prisma v6 (`^6.19.3`)** | v7 은 `datasource.url` 을 `prisma.config.ts` + driver adapter 로 강제 — 안정화 대기 |
| 2 | `middleware.ts` | **`proxy.ts` + `export async function proxy`** | Next.js 16 에서 `middleware` 컨벤션 deprecated |
| 3 | NextAuth.js | **Supabase Auth (`@supabase/ssr`)** | Supabase 단일 생태계 선택 (Phase 0 시작 전 확정) |
| 4 | Vercel Blob | **Supabase Storage** | 동일 사유 (Phase 5 에서 사용) |
| 5 | legacy `anon` / `service_role` JWT | **신규 `sb_publishable_` / `sb_secret_` key** | Supabase 2025 신규 API Key 체계 |
| 6 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` 변수명 | **`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`** | 옵션 B 선택 (사용자 결정, 변수명 명확성) |
| 7 | `SUPABASE_SERVICE_ROLE_KEY` | **`SUPABASE_SECRET_KEY`** | 동일 |
| 8 | — | **`dotenv-cli` 추가** | Prisma CLI 는 기본 `.env` 만 읽음, `.env.local` 로딩 위해 도입 |
| 9 | `max-w-6xl px-4 md:px-6` | **`.wp-container` (makipeople.com 룰)** | 사용자 요청 — 레퍼런스 사이트 측정 후 동일 수치 적용 |
| 10 | 로고 "K" 뱃지 플레이스홀더 | **`LogoMark` 인라인 SVG 컴포넌트** | 사용자가 실제 로고 SVG 제공 |
| 11 | AdminUser `passwordHash` 필드 | **제거 (Supabase Auth `auth.users.id` 매핑)** | Supabase Auth 사용에 따른 당연한 조정 |

### 디자인 시스템 토큰

```css
:root {
  /* 컬러 (기획문서 9.1) */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-light: #dbeafe;
  --color-bg: #ffffff;
  --color-bg-alt: #f8f9fa;
  --color-bg-dark: #1a1a2e;
  --color-text: #1e2229;
  --color-text-sub: #6b7280;
  --color-border: #e5e7eb;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* 컨테이너 (makipeople.com 레퍼런스) */
  --container-size: 88rem;     /* 1408px */
  --container-padding: 3.5rem; /* 56px, 데스크톱 */
}
@media (max-width: 768px) { :root { --container-padding: 1.25rem; } }
@media (min-width: 769px) and (max-width: 1024px) { :root { --container-padding: 2rem; } }
```

### 생성된 파일 (주요)

```
app/
  layout.tsx           # 루트 레이아웃 (Header/Footer, 한글 메타)
  page.tsx             # 홈 플레이스홀더 (Phase 0 체크리스트)
  globals.css          # 브랜드 토큰 + wp-container
  icon.svg             # 브라우저 탭 (모던)
  favicon.ico          # 브라우저 탭 (레거시, 16/32/48/64)
components/
  layout/Header.tsx
  layout/Footer.tsx
  layout/LogoMark.tsx
lib/
  prisma.ts
  utils.ts             # cn() = twMerge + clsx
  supabase/client.ts
  supabase/server.ts
  supabase/middleware.ts
prisma/
  schema.prisma
  migrations/20260411040657_init/migration.sql
scripts/
  verify-db.mjs        # Supabase 연결/테이블 검증
  make-favicon.mjs     # SVG → ICO 변환 (재실행 가능)
public/
  logo.svg
proxy.ts               # Next 16 proxy (Auth 보호)
.env.local             # (gitignored) 실제 Supabase 키
.env.local.example     # (committable) 템플릿
```

### 의존성 (Phase 0 최종)

- **Runtime**: next@16.2.3, react@19.2.4, @supabase/ssr@^0.10, @supabase/supabase-js@^2.103, @prisma/client@^6.19, react-hook-form@^7.72, @hookform/resolvers@^5.2, zod@^4.3, sonner@^2.0, clsx, tailwind-merge, class-variance-authority, lucide-react
- **Dev**: prisma@^6.19, dotenv-cli@^11, sharp@^0.34, png-to-ico@^3, tailwindcss@^4, eslint@^9, typescript@^5, @types/*

### 검증 로그

```
📦 Supabase 'public' schema tables:
  • _prisma_migrations
  • admin_users
  • blog_posts
  • downloads
  • inquiries
  • terms

📊 Row counts:
  admin_users     0
  blog_posts      0
  terms           0
  inquiries       0
  downloads       0
```

- `npm run build` → 성공 (Next 16 Turbopack, TypeScript 0 오류)
- `curl localhost:3000/` → HTTP 200
- `curl localhost:3000/admin` → HTTP 307 → `/admin/login?redirectTo=%2Fadmin` (proxy 보호 동작 확인)
- `curl localhost:3000/favicon.ico` → HTTP 200 (32 KB, image/x-icon)
- 컨테이너 측정: 뷰포트 1440 → 콘텐츠 1296, 좌우 여백 72 (Maki People 과 동일)

### 컨펌 상태

🟢 **암묵 컨펌** — Phase 1 진입 및 GitHub 푸시로 컨펌 간주.

---

## ✅ Phase 1 — 랜딩 페이지 (12 섹션 + FloatingCta)

**완료일**: 2026-04-11
**GitHub 커밋**: `a845e84`, `ad1235e`, `955149a` (3 batches)
**목표**: 기획문서 3.1 의 12 섹션 + 모바일 FloatingCta.

### 완료한 작업 (13 개 컴포넌트)

| # | 섹션 | 컴포넌트 | 배경 | 특이사항 |
|---|---|---|---|---|
| 1 | Hero | (app/page.tsx 내부) + HeroVisual | white | `<header>` 태그 + wp-container + 2-col grid + 5-step 시퀀셜 애니메이션 |
| - | Logo Marquee | `LogoMarquee.tsx` | (hero 내부) | Maki .c_logo_marquee 매칭, 2-set 복제 seamless 루프, 500+ 기업 placeholder |
| 2 | Pain Points | `PainPoints.tsx` | #eff4ff | 3 고충 카드 (시간/일관성/미스매칭) |
| 3 | Solution Bridge | `SolutionBridge.tsx` | white | 3-stage flow 다이어그램 |
| 4 | Kobi Intro | `KobiIntro.tsx` | white + 그라디언트 카드 | 2-col, 코비 그라디언트 카드 + 4 trait |
| 5 | Core Features | `CoreFeatures.tsx` | white | 4단계 카드 1x4 grid |
| 6 | How It Works | `HowItWorks.tsx` | #eff4ff | 5-step 타임라인 (셋업 10분 배지) |
| 7 | AI Service Detail | `AiServiceDetail.tsx` | white | 2x2 큰 카드 + 소개서 CTA |
| 8 | Candidate Experience | `CandidateExperience.tsx` | #eff4ff | 2-col + 인용구 블록 |
| 9 | Metrics | `Metrics.tsx` | #0b1b4a (다크) | 60일→2일 · 5× · 90% 큰 숫자 |
| 10 | Customer Logos | `CustomerLogos.tsx` | white | 로고 그리드 4x2 + testimonials 3개 |
| 11 | Security & Integration | `SecurityIntegration.tsx` | #eff4ff | 2x2 카드 + tag chips (ISO 27001 등) |
| 12 | Contact CTA | `ContactCta.tsx` | white (그라디언트 카드) | 큰 CTA 카드 + 미니 폼 preview |
| + | Floating CTA | `FloatingCta.tsx` | fixed bottom | 모바일 전용, scroll 500px 후 슬라이드업, dismissable |

### Maki 매칭 포인트

- **컨테이너**: `.wp-container` (88rem max, 56px padding)
- **타이포**: g_title--3xl (80/64px), g_title--l (56/40px), body-l (20/18px), g_label pill
- **컬러**: #282828 (text-1), #5f6363 (text-2), #2563eb (primary)
- **버튼**: .g_button_primary 스펙 (padding 16×32, 16/600/150%, radius 8)
- **Hero 구조**: `<header> > wp-container > grid > [text cell | visual cell]` (Maki .g_page--section 매칭)
- **모바일 메뉴**: 64×64 hamburger + slide-down overlay (header 자식 배치로 border paint-over)

### 반응형

- `<lg` (1024px) stacked 1-col
- `≥lg` 2-col symmetric (1fr/1fr)
- H1: 4rem mobile → 5rem desktop
- Body: 18px mobile → 20px desktop

---

## ✅ Phase 2 — 공개 폼 (도입 문의 + 소개서 다운로드)

**완료일**: 2026-04-11
**GitHub 커밋**: `a58e28b`
**목표**: 두 공개 폼 페이지 + API + Supabase 저장.

### 완료한 작업

**Zod 스키마** (`lib/validations.ts`)
- `inquirySchema` — 기획문서 3.4 의 9 필드
- `downloadSchema` — 기획문서 3.3 의 6 필드
- `privacyAgreed: z.boolean().refine(v => v === true)`
- 상수: `HIRE_SIZE_VALUES`, `INQUIRY_INTERESTS`, `DOWNLOAD_INTERESTS`

**API Routes**
- `POST /api/inquiries` → Prisma `inquiry.create` → 201
- `POST /api/downloads` → Prisma `download.create` → 201 + `downloadUrl`
- 에러 핸들링: 400 (JSON), 400 (검증), 500 (DB)

**`/contact` 페이지** (Maki /demo 2-column 매칭)
- Left: 별점 배지 · H1 (68px title-xl / 500 / 100%) · description · testimonial · trust 기업 로고
- Right: 9 필드 폼 카드 (RHF + zodResolver)
- sonner 토스트 + 제출 후 감사 메시지

**`/download` 페이지**
- Left: PDF preview 카드 (gradient + bullets)
- Right: 리드 수집 폼 (6 필드)
- 제출 후 `/download/thank-you?url=...` 리다이렉트

**`/download/thank-you` 페이지**
- Next 16 `async searchParams` 패턴
- `/files/` 접두사 화이트리스트 (URL 주입 방지)
- 즉시 다운로드 버튼 + 다음 단계 안내

**`public/files/supercoder-brochure.pdf`**
- Placeholder PDF 1.4 (713 bytes, 1 페이지)
- `scripts/make-brochure-pdf.mjs` 로 재생성 가능
- 실제 브로셔는 Phase 5 에서 교체

**`app/layout.tsx`**
- `<Toaster position="top-right" richColors closeButton />` 배선

### 검증 로그

```
GET /contact               → 200
GET /download              → 200
GET /download/thank-you    → 200
GET /files/supercoder-brochure.pdf → 200
POST /api/inquiries (empty) → 400 (Zod validation)
POST /api/inquiries (valid) → 201, Supabase inquiries 에 저장 확인
POST /api/downloads (valid) → 201 + downloadUrl, downloads 에 저장 확인

📊 Row counts after tests:
  inquiries       1
  downloads       1
```

### 계획 대비 변경점

| # | 원안 | 실제 적용 | 이유 |
|---|---|---|---|
| 1 | shadcn Form 컴포넌트 | React Hook Form + 커스텀 Field/SelectField | shadcn 미설치, 단순 커스텀 필드가 더 가벼움 |
| 2 | 기본 3.4 필드 구조 | Maki /demo 참고 2-column 레이아웃 + 인용/로고 | 사용자 요청 — Maki 의 /demo 디자인 반영 |

---

## ✅ Phase 3 — 관리자 인증 + 대시보드

**완료일**: 2026-04-11
**GitHub 커밋**: `de772af`
**목표**: Supabase Auth Email/Password + 보호된 /admin + 대시보드 위젯.

### 완료한 작업

**`app/admin/login/page.tsx`**
- Client component, `supabase.auth.signInWithPassword`
- Email + Password 폼, error 표시, sonner 토스트
- `redirectTo` 쿼리 파라미터 지원 (로그인 후 돌아갈 위치)
- 로그인 성공 시 `router.refresh() + router.push(redirectTo)`

**`components/admin/AdminSidebar.tsx`**
- Client component (usePathname 으로 active state)
- 5 nav items: 대시보드 / 블로그 / 약관 / 도입 문의 / 소개서 다운로드
- 사용자 이메일 표시 + 로그아웃 버튼 (supabase.auth.signOut)
- Active 링크 하이라이트 (`bg-[var(--color-primary-light)]`)

**`app/admin/layout.tsx`**
- 서버 컴포넌트, Supabase 세션 확인
- 로그인 상태일 때만 사이드바 렌더 (login 페이지는 사이드바 없음)
- `robots: { index: false, follow: false }` 메타

**`lib/auth.ts`**
- `requireAdmin()` — 서버 컴포넌트용, 세션 없으면 `/admin/login` 리다이렉트
- `getAdminUser()` — API route 용, null 반환 (호출부에서 401)

**`app/admin/page.tsx`** (대시보드)
- 서버 컴포넌트, Prisma `count` 직접 호출 (API 우회)
- 3 stat card: 도입 문의 (신규 배지) / 소개서 다운로드 / 블로그 게시글
- 최근 7일 trend + 누적 total 표시
- Quick Actions 3개: 새 글 작성 / 문의 확인 / 약관 관리
- 환영 메시지 (`{user.email?.split('@')[0]}`)

**`app/api/admin/stats/route.ts`**
- GET, `getAdminUser()` 로 인증 체크 (없으면 401)
- Prisma `Promise.all` count: inquiries (total/recent/new) / downloads (total/recent) / blogPosts (total/published)

### 검증 로그

```
/admin/login         → HTTP 200    (public 접근 가능)
/admin (unauth)      → HTTP 307 → /admin/login?redirectTo=%2Fadmin   (proxy 보호 확인)
```

- 전체 타입 체크 통과 (0 에러)
- Proxy.ts 의 admin 보호 로직 정상 동작
- 아직 실제 관리자 계정으로 end-to-end 로그인 테스트 미진행 (Supabase 대시보드에서 초기 계정 생성 필요)

### Phase 3 컨펌

🟢 **완료** — Supabase 대시보드에서 초기 관리자 계정 생성 + 로컬 로그인 테스트 성공 후 `de772af` 로 푸시.

---

## ✅ Phase 4 — 관리자 문의/다운로드 리스트 + CSV

**완료일**: 2026-04-11
**GitHub 커밋**: `6ea8f48`
**목표**: 가장 단순한 관리자 페이지 2종 (문의/다운로드 리스트) + CSV 내보내기.

### 완료한 작업

**`lib/csv.ts`** — CSV 내보내기 유틸
- `toCsv<T>(rows, columns)`: RFC 4180 (쌍따옴표 escape, CRLF) + UTF-8 BOM (Excel 한글 호환)
- `CsvColumn<T>`: generic accessor 기반, Date/배열/null 안전 처리
- `downloadCsv(filename, csv)`: client 전용 Blob + anchor 다운로드 트리거

**API 확장**
- `GET /api/inquiries` (admin): status 필터 + q 검색 (company/name/email) + limit (max 500)
- `PATCH /api/inquiries/[id]`: status / adminNote 업데이트, Zod 검증
- `GET /api/downloads` (admin): q 검색 + limit

**`/admin/inquiries`** (기획문서 4.5)
- Server: Prisma 초기 200건 조회, Date → ISO 직렬화
- Client `InquiriesTable`:
  - 상태 칩 필터 (전체/NEW/REVIEWED/CONTACTED/COMPLETED + 카운트)
  - 검색 (company/name/email)
  - 인라인 상태 드롭다운 → PATCH
  - 행 클릭 → DetailModal (기본 정보 + 메시지 + 관리자 메모 편집)
  - CSV 내보내기 (한글 헤더 포함)

**`/admin/downloads`** (기획문서 4.6)
- Server: Prisma 초기 200건 조회
- Client `DownloadsTable`:
  - 검색 + 총 건수 표시
  - 관심분야 chip 렌더
  - CSV 내보내기

### 보안 검증 로그

```
/admin/inquiries   (unauth) → 307   (proxy.ts 리다이렉트)
/admin/downloads   (unauth) → 307
GET /api/inquiries (unauth) → 401   (API 레벨 가드)
GET /api/downloads (unauth) → 401
PATCH /api/inquiries/[id] (unauth) → 401
```

---

## 🟡 Phase 5 — 관리자 블로그 CRUD + Tiptap + Storage (진행 중)

**시작일**: 2026-04-11
**GitHub 커밋**: 🟡 로컬 진행 중
**목표**: Tiptap 리치 텍스트 에디터 + Supabase Storage 이미지 업로드 + 블로그 CRUD.

### Phase 5 하위 태스크

| Task | 내용 | 상태 |
|---|---|---|
| 5-1 | Tiptap 패키지 설치 + RichEditor 컴포넌트 | ✅ 완료 |
| 5-2 | Supabase Storage + /api/upload 이미지 업로드 | ⏳ 다음 |
| 5-3 | Blog CRUD API (list/create/update/delete) | ⏳ 대기 |
| 5-4 | /admin/blog 목록 + /new + /[id] 에디터 페이지 | ⏳ 대기 |

### 추가 변경 — Admin/Public Layout 분리

사용자 요청으로 Admin 페이지에서 public Header/Footer 가 안 보이도록 route group 재구조화:

- **Root layout** (`app/layout.tsx`): Header/Footer 제거. `<html>` + `<body>` + `<Toaster>` 만
- **`app/(public)/layout.tsx`** 신규: Header + Footer wrap 전담
- **Public 페이지 이동**:
  - `app/page.tsx` → `app/(public)/page.tsx`
  - `app/contact/` → `app/(public)/contact/`
  - `app/download/` → `app/(public)/download/`
- **Admin** (`app/admin/*`): 변화 없음. 기존 `app/admin/layout.tsx` 가 사이드바만 담당 → Header/Footer 영향 0

Route groups 는 URL 에 영향 없음 (`/contact` 는 여전히 `/contact`). Admin 페이지는 public layout 을 거치지 않아 header/footer 가 렌더되지 않음.

### Task 5-1 완료 — RichEditor 컴포넌트

**패키지 설치** (+ 81 packages):
- `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`
- Extensions: Image, Link, Placeholder, Table (+row/header/cell), Youtube, CodeBlockLowlight
- `lowlight` (코드 하이라이팅)

**`components/admin/RichEditor.tsx`**
- Editor: StarterKit + 모든 extensions, `immediatelyRender: false` (SSR 경고 방지)
- Toolbar: Undo/Redo + Heading 1/2/3 + Bold/Italic/Strike/Code + List/Ordered/Quote/CodeBlock/HR + Link/Image/Table/YouTube
- `handleFileChange`: 이미지 파일 선택 → `POST /api/upload` 로 전송 → 응답 URL 을 Tiptap `setImage` 로 삽입 (`/api/upload` 는 Task 5-2 에서 구현 예정)
- `handleAddLink`, `handleAddYoutube`, `handleAddTable` 헬퍼
- 스타일: `.prose-editor` 클래스 (globals.css 에 prose 스타일 추가 필요)

**발견한 이슈 & 해결**:
1. Tiptap v3 에서 default export 제거 → 모든 extension named import 로 수정 (`import { StarterKit }` 등)
2. `lucide-react` 1.8 에 `Youtube` 아이콘 없음 → `Film` 으로 대체 (`import { Film as YoutubeIcon }`)
3. `.next/types/validator.ts` stale 캐시 → `.next` 삭제 후 dev 서버 재시작

### 검증 로그 (Phase 5 진행 중)

```
/              → 200 (public layout, Header 정상)
/contact       → 200 (public layout)
/download      → 200 (public layout)
/admin/login   → 200 (admin layout, no public Header)
/admin/inquiries (unauth) → 307 (proxy 리다이렉트)
```

---

## 📋 남은 Phase 개요

| Phase | 내용 | 주요 컴포넌트 |
|---|---|---|
| 5 (남은 3 tasks) | 블로그 CRUD 완료 | /api/upload, /api/blog, /admin/blog/[new\|id] |
| 6 | 공개 블로그 | /blog, /blog/[slug], SSG/ISR, Tiptap JSON → HTML 렌더 |
| 7 | 약관 관리 + 공개 약관 | /admin/terms, /privacy, /terms-enterprise, /terms-candidate |
| 8 | Trial 플레이스홀더 + SEO | /trial, sitemap, robots, 404/500, Vercel Analytics |
| 9 | Vercel 배포 | GitHub → Vercel, 환경 변수, Prisma `migrate deploy`, 도메인 |

---

*각 Phase 완료 시 본 문서에 완료일/변경점/검증 로그 추가.*
