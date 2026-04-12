# 사용자 행동 분석 (Analytics) 스펙

> 작성일: 2026-04-12
> 상태: Phase 1 구현 중

## 목적

랜딩 페이지에서 사용자가:
1. **어떤 섹션까지 스크롤하는지** (Section Scroll Depth)
2. **페이지에 얼마나 머무는지** (Page Dwell Time)
3. **어떤 버튼을 많이 클릭하는지** (CTA Click Tracking)

를 정량적으로 측정하여 전환율 개선 의사결정에 활용한다.

---

## 정의

### 1. 섹션 도달률 (Section View)

| 항목 | 정의 |
|---|---|
| **트리거** | 섹션 요소가 뷰포트에 **50% 이상** 보이는 순간 (`IntersectionObserver threshold: 0.5`) |
| **카운트 단위** | **세션 당 1회** — 같은 세션에서 같은 섹션을 여러 번 스크롤해도 중복 카운트 안 함 |
| **세션 정의** | `sessionStorage` 기반 UUID. 탭 종료/새 탭 열면 새 세션. 새로고침은 같은 세션 유지 |
| **대상 페이지** | `/` (홈 랜딩) — 13개 섹션 |
| **저장** | `SectionView` 카운터 테이블: `{ path, section, viewCount }`. Upsert + increment |
| **해석** | "Hero 1,234 → Pain Points 1,089" = 12% drop-off. Hero 뷰 수 대비 각 섹션의 잔존율(%) 산출 |

**측정 대상 섹션 (13개, 순서대로)**:

| ID | 컴포넌트 | 설명 |
|---|---|---|
| `hero` | Hero header | 최상단 |
| `logo_marquee` | LogoMarquee | 고객 로고 티커 |
| `pain_points` | PainPoints | 3가지 고충 |
| `solution_bridge` | SolutionBridge | 전환 섹션 |
| `kobi_intro` | KobiIntro | AI Agent 소개 |
| `core_features` | CoreFeatures | 4단계 기능 |
| `how_it_works` | HowItWorks | 5스텝 타임라인 |
| `ai_service_detail` | AiServiceDetail | Deep dive |
| `candidate_experience` | CandidateExperience | 지원자 경험 |
| `metrics` | Metrics | 60일→2일 등 |
| `customer_logos` | CustomerLogos | 100+ 기업 |
| `security_integration` | SecurityIntegration | 보안/연동 |
| `faqs` | Faqs | FAQ 아코디언 |
| `contact_cta` | ContactCta | 최종 CTA |

### 2. 페이지 체류 시간 (Page Dwell Time)

| 항목 | 정의 |
|---|---|
| **측정 시작** | 페이지 마운트 시점 (`useEffect` 의 `performance.now()`) |
| **측정 종료** | 페이지 언마운트 OR `visibilitychange` 이벤트(hidden) OR `pagehide` 이벤트 |
| **최소 임계값** | **500ms** 미만은 discard (bounce/misclick) |
| **최대 임계값** | **3,600,000ms** (1시간) — 탭 방치 방지 cap |
| **저장** | `PageDwell` 카운터 테이블: `{ path, totalMs, sampleCount }`. Upsert |
| **평균 계산** | `totalMs / sampleCount` (런타임 계산, DB 에 average 컬럼 없음) |
| **단위** | 밀리초 (ms). Admin UI 에서 `Xm Ys` 형식으로 표시 |
| **범위** | 페이지 전체 (섹션별 체류는 Phase 3 고려) |

### 3. CTA 클릭 추적 (CTA Click)

| 항목 | 정의 |
|---|---|
| **트리거** | `data-track="label"` 속성이 있는 요소를 클릭한 순간 |
| **방식** | `document` 에 이벤트 위임 (delegation). 클릭 발생 → closest `[data-track]` 탐색 → 있으면 이벤트 발사 |
| **중복** | 같은 세션에서 같은 버튼 여러 번 클릭 → **매번 카운트** (의도된 행동) |
| **저장** | `CtaClick` 카운터 테이블: `{ path, label, clickCount }`. Upsert + increment |
| **label 컨벤션** | `cta_{위치}_{대상}` 형식. 예: `cta_hero_contact`, `cta_floating_inquiry`, `cta_blog_cta_demo` |

---

## 아키텍처

```
Browser (Client)                     API                        DB
─────────────────                   ─────                     ──────
IntersectionObserver  ─┐
Click delegate        ─┤  queue   ─→  POST /api/analytics  ─→  Upsert
Dwell (pagehide)      ─┘  (batch)     (Zod validation          (SectionView,
                          flush 5s     + bot filter              CtaClick,
                          or 10 events + $transaction)           PageDwell)
                          or pagehide
```

### 전송 방식

- **배치 큐**: 이벤트 발생 즉시 메모리 큐에 push. 10개 모이거나 5초 경과 시 flush
- **전송 API**: `navigator.sendBeacon` 우선 (탭 닫아도 안전), fallback `fetch(keepalive: true)`
- **1 HTTP 요청 = N 이벤트** — 네트워크 오버헤드 최소화
- **body**: `{ sessionId: uuid, events: [{type, path, section?, label?, value?}] }`

### 저장 방식

- **Raw event 테이블 없음** — 카운터만 (upsert + increment). DB 행 수가 O(섹션 × 페이지) = 상수
- SectionView: 13 섹션 × 1 페이지 = 13 rows
- CtaClick: ~10 CTA × ~5 페이지 = ~50 rows
- PageDwell: ~10 페이지 = 10 rows
- **총 ~73 rows** — 100만 이벤트를 처리해도 DB 행 수 변화 없음

### 프라이버시

- PII 없음 (세션 UUID 만, 쿠키 없음, IP 저장 없음)
- sessionStorage = 탭 종료 시 자동 삭제
- Admin 페이지/API 경로는 추적 제외
- 봇 필터: user-agent 패턴 매칭 (기존 page-views 와 동일)

---

## 시간 범위

### Phase 1 (현재)

누적 전체 (all time). 카운터 테이블에 타임스탬프 필터 없이 집계.

### Phase 2 (후속)

`DailyAnalytics` rollup 테이블 도입. 매일 자정 cron 또는 on-demand 로
당일 카운터를 1행으로 기록. Admin UI 에서 7일/30일/전체 필터.

---

## Admin Dashboard 위젯 (Phase 1)

### 1. Section Funnel (/) — 가로 바 차트

```
Hero                ████████████ 1,234  100%
Pain Points         ███████████  1,089   88%  (↓12%)
...
Contact CTA         ██             187   15%  (↓85%)
```

- Y축: 섹션 (순서대로)
- X축: viewCount
- % 계산: `viewCount / heroViewCount * 100`
- Drop-off 표시: 직전 섹션 대비 하락폭

### 2. Top CTAs — 클릭 수 랭킹 테이블

```
#  Label                   Clicks
1  cta_hero_contact         287
2  cta_floating_inquiry     198
3  cta_contactcta_demo      154
...
```

### 3. Average Dwell — 페이지별 평균 체류 시간

```
Path         Avg Dwell    Samples
/            1m 23s        1,234
/blog        2m 14s          456
/contact     0m 47s          289
...
```

---

## 파일 구조 (예정)

```
lib/analytics/
  session.ts      — sessionId (sessionStorage UUID)
  queue.ts        — 이벤트 배치 큐 + flush 로직
components/analytics/
  SectionTracker.tsx  — IntersectionObserver 래퍼 (RSC children 감싸기)
  ClickTracker.tsx    — document 이벤트 위임 (data-track)
  DwellTracker.tsx    — usePathname + performance.now + pagehide
app/api/analytics/
  route.ts        — POST 배치 수신 + upsert + bot filter
app/admin/analytics/
  page.tsx         — 서버 컴포넌트, requireAdmin + Prisma 직접 조회
  AnalyticsDashboard.tsx — 클라이언트, 3 위젯 렌더
prisma/schema.prisma
  SectionView, CtaClick, PageDwell 모델
```
