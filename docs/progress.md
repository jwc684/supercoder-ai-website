# 슈퍼코더 AI Interviewer — 구현 진행 로그

> 이 문서는 각 Phase 의 완료일, 계획 대비 변경점, 컨펌 여부를 영속적으로 기록한다.
> 마스터 플랜: `/Users/jay/.claude/plans/quirky-launching-pearl.md`
> 원본 기획문서: `docs/AI_Interviewer_기획문서_v2.md`

---

## 📊 전체 상황판

| Phase | 내용 | 상태 | 컨펌 |
|---|---|---|---|
| 0 | 기반 구축 (Next.js + Supabase + Prisma + 레이아웃) | ✅ 완료 (2026-04-11) | 🟡 대기 |
| 1 | 랜딩 페이지 12 섹션 | ⏳ 대기 | — |
| 2 | 도입 문의 + 소개서 다운로드 (공개 폼) | ⏳ 대기 | — |
| 3 | 관리자 인증 + 대시보드 | ⏳ 대기 | — |
| 4 | 관리자 — 문의/다운로드 리스트 | ⏳ 대기 | — |
| 5 | 관리자 — 블로그 CRUD + Tiptap + Storage | ⏳ 대기 | — |
| 6 | 공개 블로그 (목록 + 상세) | ⏳ 대기 | — |
| 7 | 관리자 약관 + 공개 약관 페이지 | ⏳ 대기 | — |
| 8 | Trial 플레이스홀더 + SEO + 마무리 | ⏳ 대기 | — |
| 9 | Vercel 배포 | ⏳ 대기 | — |

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

🟡 **사용자 컨펌 대기 중** — Phase 1 진입 전 최종 확인 필요.

---

## ⏳ Phase 1 — 랜딩 페이지 (예정)

**목표**: 기획문서 3.1 의 12 섹션 전체 구현.

예정 섹션: Hero · Pain Points · Solution Bridge · 코비 소개 · 핵심 기능 · 작동 방식 · AI 서비스 상세 · 지원자 경험 · 성과 지표 · 고객 사례 · 보안/연동 · 도입 문의 CTA + Floating CTA (모바일).

**진입 조건**: Phase 0 사용자 컨펌.

---

*Phase 1 이상 각 Phase 완료 시 본 문서에 완료일/변경점/검증 로그 추가 예정.*
