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
| 5 | 관리자 — 블로그 CRUD + Tiptap + Storage | ✅ 완료 (2026-04-11) | 🟢 컨펌 (push 완료) |
| 6 | 공개 블로그 (목록 + 상세) | ✅ 완료 (2026-04-11) | 🟡 로컬 (push 전) |
| 7 | 관리자 약관 + 공개 약관 페이지 | ✅ 완료 (2026-04-11) | 🟡 로컬 (push 전) |
| + | FAQ 기능 (모델 + API + 관리자 + 랜딩) — 추가 | ✅ 완료 (2026-04-11) | 🟡 로컬 (push 전) |
| + | Maki UI 폴리싱 (Blog CTA · Contact · FAQ 폭) — 추가 | ✅ 완료 (2026-04-11) | 🟡 로컬 (push 전) |
| 8 | Trial 플레이스홀더 + SEO + 마무리 | ⏳ 대기 | — |
| 9 | Vercel 배포 | ⏳ 대기 | — |

### 🔗 GitHub 리모트
- Repo: https://github.com/jwc684/supercoder-ai-website
- 최신 푸시: `109dda9 test: Vitest 기반 API 통합 테스트 4 파일 (30 tests 전부 통과)`
- 로컬 미커밋: Phase 6 · Phase 7 · FAQ 기능 · Maki UI 폴리싱

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

## ✅ Phase 5 — 관리자 블로그 CRUD + Tiptap + Storage

**완료일**: 2026-04-11
**GitHub 커밋**: `bba2370` (Task 5-1 + 레이아웃 분리), `ee57199` (Task 5-2~5-4 완료)
**목표**: Tiptap 리치 텍스트 에디터 + Supabase Storage 이미지 업로드 + 블로그 CRUD.

### Phase 5 하위 태스크

| Task | 내용 | 상태 |
|---|---|---|
| 5-1 | Tiptap 패키지 설치 + RichEditor 컴포넌트 | ✅ 완료 |
| 5-2 | Supabase Storage + /api/upload 이미지 업로드 | ✅ 완료 |
| 5-3 | Blog CRUD API (list/create/update/delete) | ✅ 완료 |
| 5-4 | /admin/blog 목록 + /new + /[id] 에디터 페이지 | ✅ 완료 |

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

### Task 5-2 완료 — Supabase Storage + /api/upload

**`scripts/setup-storage.mjs`**
- `blog-images` 버킷 자동 생성 (public, 5MB 제한, jpeg/png/webp/gif)
- 이미 존재 시 public 설정 확인/업데이트
- 실제 실행 확인: `✅ 버킷 'blog-images' 생성 완료`

**`lib/supabase/admin.ts`**
- `createAdminClient()`: service role (SUPABASE_SECRET_KEY) 기반
- RLS 우회용, **서버 전용** (클라이언트 import 금지)

**`POST /api/upload`**
- 관리자 인증 필수 (`getAdminUser`)
- multipart/form-data `file` 필드
- MIME 화이트리스트: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- 크기 제한: 5MB (버킷 설정과 일치)
- 파일명: `YYYY/MM/uuid.ext` (연도/월 폴더 구조)
- 응답: `{ ok, url, path, size, mime }`

### Task 5-3 완료 — Blog CRUD API

**`lib/validations.ts` 확장**
- `blogPostSchema`: title / slug / content (Tiptap JSON) / excerpt / thumbnail / category / tags / status / publishedAt / seoTitle / seoDesc
- Slug regex: `/^[a-z0-9\uAC00-\uD7A3-]+$/` (한글 + 영소문자 + 숫자 + 하이픈)
- `slugify()` 유틸: 한글 유지, 공백 → 하이픈, 중복 하이픈 제거
- `BLOG_CATEGORIES` / `BLOG_CATEGORY_LABELS` / `POST_STATUSES` 상수

**`GET /api/blog`**
- 공개 (unauth): `status: PUBLISHED` 만
- 관리자 (auth): DRAFT + PUBLISHED 모두
- Query: `category`, `q` (title/slug 검색), `limit` (max 100)
- `content` 필드는 목록에서 제외 (무거움)

**`POST /api/blog`** (admin)
- `blogPostSchema.safeParse` 검증
- `AdminUser` upsert: Supabase `auth.users.id` ↔ Prisma `AdminUser.id` 매핑 (자동 동기화)
- `PUBLISHED` + `publishedAt` 미지정 → 현재 시각 자동
- Slug 중복 (`P2002`) → 409

**`GET/PUT/DELETE /api/blog/[id]`**
- GET: 공개는 PUBLISHED 만, admin 은 모두
- PUT: 전체 필드 업데이트, slug 중복 409
- DELETE: 삭제

### Task 5-4 완료 — /admin/blog 페이지 3종

**`/admin/blog`** (목록)
- 서버 컴포넌트 Prisma 직접 조회 (200건)
- `BlogListToolbar` (클라이언트): URL 쿼리 기반
  - 상태 칩 필터 (전체/초안/발행)
  - 카테고리 칩 필터 (전체/4개)
  - 제목/슬러그 검색 (form submit → URL 업데이트)
- 테이블: 제목/슬러그/카테고리/상태pill/발행일/액션(편집+공개보기)

**`/admin/blog/new`**
- `BlogEditorForm` (mode="new") 렌더
- 목록으로 돌아가기 링크

**`/admin/blog/[id]`**
- Prisma `findUnique`, 존재하지 않으면 `notFound()`
- `Date → "YYYY-MM-DDTHH:mm"` 로 `datetime-local` input 대응
- `BlogEditorForm` (mode="edit") 에 initial 전달

**`BlogEditorForm`** (재사용 클라이언트 컴포넌트, 461줄)
- **좌측**: 제목 대형 입력 + 슬러그 (제목 변경 시 자동 생성, 수동 편집 시 lock) + RichEditor
- **우측 사이드바**:
  1. 저장 버튼 (`POST /api/blog` 또는 `PUT /api/blog/[id]`) + 삭제 (edit mode)
  2. 게시 설정 카드: 상태 (초안/발행) 토글, 카테고리 select, 발행 예약일 (`datetime-local`)
  3. 태그 카드: Enter 로 태그 추가, X 로 제거
  4. 썸네일 카드: 클릭 → `/api/upload` 업로드 → URL 저장, 미리보기 이미지, 제거 버튼
  5. 메타 정보 카드: 요약 (excerpt) + SEO 제목 + SEO 설명

### 검증 로그

```
/              → 200 (public layout)
/admin/login   → 200 (admin layout, no public Header)
/admin/blog    (unauth) → 307 (proxy 리다이렉트)
/admin/blog/new (unauth) → 307
GET  /api/blog  (public) → 200 (PUBLISHED 필터)
POST /api/blog  (unauth) → 401
PUT  /api/blog/[id] (unauth) → 401
DELETE /api/blog/[id] (unauth) → 401
POST /api/upload (unauth) → 401
```

- Supabase Storage `blog-images` 버킷 실제 생성 확인
- TypeScript 0 에러

### Phase 5 설치된 패키지 (+81)

- `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`
- Extensions: `@tiptap/extension-image`, `-link`, `-placeholder`, `-table`, `-table-row`, `-table-header`, `-table-cell`, `-youtube`, `-code-block-lowlight`
- `lowlight` (코드 하이라이팅)

---

## ✅ Phase 6 — 공개 블로그 (/blog 목록 + /blog/[slug] 상세)

**완료일**: 2026-04-11
**GitHub 커밋**: 🟡 로컬 진행 중
**목표**: Tiptap JSON → HTML 서버 렌더, 카테고리 필터, TOC, 관련 글, CTA 배너, ISR.

### 완료한 작업

**`lib/tiptap.ts`** — Tiptap HTML 렌더러
- `tiptapExtensions`: RichEditor + 서버 양쪽에서 공유 (Placeholder 만 제외)
- `renderTiptap(json)`: `@tiptap/html generateHTML` 호출 + 헤딩에 id 주입 (중복 slug 처리)
- `TocEntry` 타입: `{ level, text, id }`
- `extractPlainText(json, maxLen)`: 텍스트 추출 (meta description 자동 생성용)
- `estimateReadingTime(json)`: 한글 기준 분당 500자 어림셈

**`app/(public)/blog/page.tsx`** — 목록 페이지
- SSR + `revalidate = 60` (ISR 60초)
- `generateMetadata`: "블로그" 타이틀, 소개 설명
- Prisma 직접 조회 (PUBLISHED, 최근 60건)
- URL 쿼리 기반 카테고리 필터 (`?category=AI_HIRING` 등)
- 카테고리 필터 칩 5개 (전체 + 4 카테고리)
- 3-col 카드 그리드 (md:2-col, sm:1-col)
- 카드: 썸네일 + 카테고리 배지 + 읽기 시간 + 제목 + 요약 + 날짜
- 썸네일 없을 때: gradient placeholder + 책 아이콘
- 빈 상태: 필터 있을 때 / 없을 때 분기 메시지

**`app/(public)/blog/[slug]/page.tsx`** — 상세 페이지
- `generateStaticParams`: 모든 PUBLISHED 글 slug (SSG 사전 생성)
- `generateMetadata`: title, description (seoTitle/seoDesc/excerpt/auto 우선순위),
  OpenGraph (article type + published time + thumbnail), Twitter summary_large_image
- 본문 렌더: `dangerouslySetInnerHTML` + `.prose-blog` 클래스
- 레이아웃: `lg:grid-cols-[1fr_240px]` (본문 + sticky TOC 사이드바)
- TOC: 헤딩 레벨별 들여쓰기 (h1 no indent / h2 pl-2 / h3 pl-4)
- CTA 배너: 브랜드 그라디언트 + "데모 신청하기" 링크
- 관련 글: 같은 카테고리 3건, NOT 본 글
- 404: `notFound()` — PUBLISHED 아닌 글은 노출 금지

**`app/globals.css`** — `.prose-blog` 타이포
- h1/h2/h3, p, a, strong, em, ul, ol, li, blockquote, img, pre, code, hr, table, iframe
- 블록체인 컬러: 링크 = primary, 코드 = primary-light bg, pre 배경 = `#0b1b4a` (다크)
- 이미지 rounded + border
- 첫 자식 헤딩 margin-top: 0

**`next.config.ts`** — Supabase Storage 이미지 도메인 허용
- `remotePatterns`: `{ protocol: 'https', hostname: <supabase-host>, pathname: '/storage/v1/object/public/**' }`
- Supabase URL 환경변수에서 자동 파싱

### 검증 로그

```
/blog                                → 200
/blog?category=INSIGHT               → 200
/blog/ai-science-a-new-paradigm-for-skill-assessment → 200
```

- TypeScript 0 에러
- 기존 블로그 글 (DRAFT) 을 PUBLISHED 로 승격 후 /blog 에서 정상 렌더 확인
- ISR 60초 재검증, 본문은 Tiptap JSON → HTML 서버 렌더 + TOC 자동 생성

### 설치된 패키지 (+1)
- `@tiptap/html` (서버 사이드 generateHTML)

---

## ✅ Phase 7 — 관리자 약관 CRUD + 공개 약관 페이지

**완료일**: 2026-04-11
**GitHub 커밋**: 🟡 로컬 진행 중
**목표**: Terms 모델 CRUD + 동일 type 단일 활성화 규칙 + /privacy · /terms-enterprise · /terms-candidate 동적 렌더.

### 완료한 작업

**`lib/validations.ts` 확장**
- `termsSchema`: title / type / content (Tiptap JSON) / version / effectiveDate
- `TERMS_TYPES` 상수 (PRIVACY / ENTERPRISE / CANDIDATE / MARKETING)
- `TERMS_TYPE_LABELS` 한글 레이블 매핑

**API Routes** (모두 관리자 보호)
- `GET /api/terms` — 목록 조회, type 필터 + limit
- `POST /api/terms` — 신규 생성 (초기 `isActive: false`)
- `GET/PUT/DELETE /api/terms/[id]`
- `PATCH /api/terms/[id]/activate` — 활성화 토글
  - body `{ active: boolean }`
  - `active=true` 시 **트랜잭션**으로 동일 type 의 기존 활성 약관을 자동 비활성화 후 대상만 활성화
- `GET /api/terms/active/[type]` — 공개용, 활성 약관 1건 반환 (인증 불필요)

**`/admin/terms`** (목록)
- 서버 컴포넌트 Prisma 직접 조회 (최대 200건)
- 테이블: 약관명 / 유형 / 버전 / 상태 pill / 시행일 / 액션
- 상태 pill: 활성 (녹색 ✓) / 비활성 (회색 ○)

**`/admin/terms/new`, `/admin/terms/[id]`**
- `TermsEditorForm` (재사용 클라이언트 컴포넌트)
- 좌측: 약관명 대형 입력 + RichEditor (Phase 5 RichEditor 재사용)
- 우측 사이드바:
  1. 저장 버튼 (POST 또는 PUT) + 삭제 (edit mode)
  2. **공개 상태 토글** (edit mode only) — window.confirm 경고 후 `/activate` PATCH 호출
     - 활성화 시 "동일 유형의 기존 활성 약관이 자동 비활성화됩니다" 안내
  3. 메타 정보: 유형 select / 버전 input / 시행일 `datetime-local`

**공개 약관 페이지** (SSR + `revalidate = 60`)
- `components/landing/TermsView.tsx` — `type` prop 받아 활성 약관을 조회, `.prose-blog` 로 렌더
- 활성 약관이 없으면 플레이스홀더 ("약관 준비 중") 표시
- `app/(public)/privacy/page.tsx` — PRIVACY
- `app/(public)/terms-enterprise/page.tsx` — ENTERPRISE
- `app/(public)/terms-candidate/page.tsx` — CANDIDATE
- 각 페이지에 `metadata` (title / description / `robots: index:true`)

### 검증 로그

```
GET /api/terms             (unauth) → 401
GET /api/terms/active/PRIVACY       → 200 (no auth required)
PATCH /api/terms/[id]/activate (unauth) → 401
/admin/terms               (unauth) → 307
/admin/terms/new           (unauth) → 307
/privacy, /terms-enterprise, /terms-candidate → 200
```

- TypeScript 0 에러
- 동일 type 에서 활성 약관은 항상 1건만 존재 (트랜잭션 보장)

---

## ✅ 추가 구현 — FAQ 기능 (원안 외)

**완료일**: 2026-04-11
**GitHub 커밋**: 🟡 로컬 진행 중
**목표**: Maki `.c_faq` 섹션을 랜딩 페이지에 추가 + 관리자에서 CRUD/순서/공개 제어.

### DB + Validation

**`prisma/schema.prisma`** — `Faq` 모델 추가
```prisma
model Faq {
  id          String   @id @default(cuid())
  question    String
  answer      Json      // Tiptap JSON
  order       Int       @default(0)
  isPublished Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([isPublished, order])
  @@map("faqs")
}
```
- 마이그레이션: `20260411112343_add_faqs`

**`lib/validations.ts`**
- `faqSchema`: question / answer (Tiptap JSON) / order? / isPublished?
- `faqReorderSchema`: `{ items: [{ id, order }, …] }`

### API Routes (모두 `revalidatePath("/")` 무효화 포함)

- `GET /api/faqs?published=1` — **공개용**, `isPublished=true` 만, 인증 불필요
- `GET /api/faqs` — 관리자 전체
- `POST /api/faqs` — 신규 생성, order 자동 부여 (max+1), isPublished 반영 시 캐시 무효화
- `GET/PUT/DELETE /api/faqs/[id]` — 단일 CRUD
- `PATCH /api/faqs/reorder` — 순서 일괄 재배치 (트랜잭션 + 캐시 무효화)

### Admin UI (`/admin/faqs`)

- **목록** (`page.tsx` + `FaqListClient.tsx`)
  - ↑↓ 화살표로 순서 조정 (낙관적 업데이트 + PATCH reorder)
  - 공개 상태 칩 토글 (인플레이스 GET → PUT)
  - 삭제 + 편집 링크
- **생성/수정** (`new/page.tsx`, `[id]/page.tsx` + `FaqEditorForm.tsx`)
  - RichEditor 재사용 (답변 Tiptap JSON)
  - 사이드바 **최상단**에 iOS-style 토글 스위치 (role="switch" + 키보드 지원)
  - 저장 버튼 레이블이 상태 반영 ("공개로 저장" / "비공개로 저장")
  - 신규 생성 시 기본값 `isPublished = true` — 저장 1회로 즉시 랜딩 반영
- **AdminSidebar** 에 "FAQ" 메뉴 추가 (`HelpCircle` 아이콘)

### Landing UI (`components/landing/Faqs.tsx` + `FaqAccordionItem.tsx`)

- Maki `.c_faq` 매칭, 12-col 5|6 split:
  - 좌측 col 1–5: `g_label` eyebrow ("FAQ") + g_title--l H2 ("자주 묻는 질문") + subtitle, `lg:sticky top-[120px]`
  - **우측 col 7–12 (약 절반 너비)**: 아코디언 리스트
- `Schema.org FAQPage + Question/Answer` microdata
- 서버에서 `renderTiptap(answer)` 로 HTML 미리 생성 후 client accordion 에 전달
- 클라이언트 `FaqAccordionItem`: chevron 회전 + `grid-rows` 트랜지션, `aria-expanded`/`aria-controls`
- 공개 FAQ 가 0 개면 섹션 자체를 렌더하지 않음 (`return null`)
- 배치: `app/(public)/page.tsx` 의 `SecurityIntegration` 과 `ContactCta` 사이

### 캐싱

- `app/(public)/page.tsx` 에 `export const revalidate = 60` (ISR 60초)
- Prisma 직접 호출은 자동 dynamic 이 아니므로 명시적 revalidate 필요
- API mutation 경로마다 `revalidatePath("/")` 호출 → 60 초 이전에도 즉시 반영

### 검증 로그

```
/api/faqs?published=1   → 200 (공개용)
/api/faqs               (unauth) → 401
/api/faqs/reorder       (unauth) → 401
/admin/faqs             (unauth) → 307
/                       → 200 (FAQ 섹션 SSR 렌더 확인)
```

- TypeScript 0 에러
- DB 직접 업데이트 → `/` HTML 에 "What is Maki People?" 렌더 확인

### UX 개선 히스토리 (사용자 피드백 반영)

1. **Landing 미노출 문제** — 등록한 FAQ 가 랜딩에 안 보임 → 원인은 `isPublished: false` 기본값
   - **수정**: 새 FAQ 기본값 `true` + 토글을 사이드바 최상단으로 이동 + 저장 버튼 레이블 상태 반영
2. **FAQ 리스트 폭** — Maki 처럼 약 절반 너비로 → 12-col grid `col-span-4|8` → `col-span-5|6 col-start-7`

---

## ✅ 추가 구현 — Maki UI 폴리싱

**완료일**: 2026-04-11
**GitHub 커밋**: 🟡 로컬 진행 중
**목표**: 사용자 피드백 기반으로 Blog 푸터 CTA / `/contact` / FAQ 레이아웃을 Maki 원본에 가깝게 조정.

### Blog 푸터 CTA (`components/landing/BlogFooterCta.tsx`)

`/blog` 목록 + `/blog/[slug]` 상세 공용 푸터 CTA 컴포넌트:

1. **1차 수정**: 배경색을 main blue (`var(--color-primary)`) 로 — 사용자 요청 ("옅은 파란 → main blue")
2. **2차 수정**: full-bleed → **`wp-container` 안의 rounded 2xl 카드** 로 변경 (Maki `.c_footer_cta` 가 `g_page--container` 안에 배치된 구조 매칭)
   - 컨텐츠 폭이 블로그 본문 폭과 정확히 일치
   - 흰 헤딩 + 흰/반투명 subtitle + 흰 배경 primary 버튼 + outline 버튼
   - 4개 stat card (60일→2일, 5×, 90%, 95%) 는 `border-t border-white/20` 구분선 포함

### `/contact` 데모 신청 페이지 (`app/(public)/contact/page.tsx`)

Maki `/demo` 구조로 재구성:

- **12-col 6|6 split** (이전엔 `grid-cols-[1fr_1fr]`)
- **좌측** (`g_flex--dvlsb` 매칭): top block + bottom social-proof block
  - Top: G2-style 배지 카드 (빨간 G2 로고 박스 + 5-별 + "4.7/5 on G2.com") → H1 `g_title--xl` → subtitle
  - Bottom (`c_demo_page--social_proof`): 리뷰 카드 (`rounded-2xl border` + 구분선 + 프로필) + "엔터프라이즈가 신뢰하는 파트너" + 로고 행
- **우측** 폼 카드:
  - **옅은 파란색 배경** `bg-[#eff4ff]` (사용자 요청)
  - border 제거 — 배경색이 구분선 역할
  - 타이틀 "데모 신청" (`g_title--s_sans` 톤, 22/24px) + 안내 subtitle
  - 관심 서비스 pill 액티브 상태: primary-light → **solid primary + 흰 텍스트** (파란 카드 배경 대비)
  - input/textarea/select 는 모두 `bg-white` 로 유지
- Zod + RHF 폼 로직, `/api/inquiries` 연동, 성공 상태 화면 모두 유지

### FAQ 레이아웃 (`components/landing/Faqs.tsx`)

- 12-col grid: `col-span-4 | col-span-8` → **`col-span-5 | col-span-6 col-start-7`**
- 결과: 아코디언 리스트가 약 절반 너비 (6/12), 헤딩과 1-col gutter 간격
- `lg:sticky top-[120px]` 유지 (스크롤 시 헤딩 고정)

### 검증 로그

```
/blog                → 200  (constrained blue card)
/blog/[slug]         → 200  (동일)
/contact             → 200  (6|6 split + 옅은 파란 폼 카드)
/                    → 200  (FAQ 5|6 split)
```

- TypeScript 0 에러

---

## 📋 남은 Phase 개요

| Phase | 내용 | 주요 컴포넌트 |
|---|---|---|
| 8 | Trial 플레이스홀더 + SEO | /trial (곧 출시 안내 + CTA), sitemap.xml, robots.txt, OG 메타, 404/500, Vercel Analytics |
| 9 | Vercel 배포 | GitHub → Vercel, 환경 변수 4종, Prisma `migrate deploy` postinstall, 프리뷰 → 프로덕션 → 도메인 |

---

*각 Phase 완료 시 본 문서에 완료일/변경점/검증 로그 추가.*
