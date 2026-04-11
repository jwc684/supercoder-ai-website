# 슈퍼코더 AI Interviewer — 웹사이트 기획 문서 v2

> 작성일: 2026-04-10
> Screening Agent 이름: **코비 (Kobi)**
> 기술 스택: Next.js 풀스택 + Vercel
> 참고 사이트: makipeople.com (Maki People — AI Screening Agent "Mochi")

---

## 1. 프로젝트 개요

### 1.1 목적
슈퍼코더 AI Interviewer의 제품 웹사이트를 구축한다. 단순 소개 페이지를 넘어, 블로그 CMS, 관리자 패널, 도입 문의 수집, 서비스 소개서 다운로드, AI 면접 무료 체험까지 포함하는 **풀스택 웹 애플리케이션**이다.

### 1.2 타겟 사용자

| 사용자 유형 | 설명 | 주요 니즈 |
|------------|------|----------|
| HR 의사결정자 | 채용 책임자, CHRO, 인사팀장 | ROI, 보안, 레퍼런스 |
| 채용 실무자 | 채용 담당자, 리크루터 | 기능 상세, 사용 편의성, 도입 절차 |
| 지원자 | AI 면접 응시자 | 면접 체험, 투명한 프로세스 |
| 블로그 독자 | HR/채용 관심자 | 인사이트, 트렌드, 활용 사례 |

### 1.3 핵심 전환 목표

| 우선순위 | 전환 행동 | 측정 지표 |
|---------|----------|----------|
| 1 | 도입 문의 제출 | form_submit 수 |
| 2 | 서비스 소개서 다운로드 | download 수 |
| 3 | AI 면접 무료 체험 | trial_start 수 |
| 4 | 블로그 유입 → 전환 | blog → CTA 클릭률 |

### 1.4 Screening Agent "코비(Kobi)"
Maki People의 "Mochi"처럼, 슈퍼코더의 AI Screening Agent에 고유한 이름과 페르소나를 부여한다.

- **이름**: 코비 (Kobi)
- **역할**: AI 면접관 — 채용공고 분석, 역량 추출, 질문 설계, 실시간 면접 진행, 평가 리포트 생성
- **톤**: 전문적이면서도 따뜻한, 구조화된 대화
- **시각적 아이덴티티**: 브랜드 컬러(#2563EB) 기반 아이콘/일러스트, 웹사이트 전반에 코비 캐릭터 활용

---

## 2. 사이트맵 (정보 구조)

```
슈퍼코더 AI Interviewer
│
├── 🏠 Public Pages (비인증)
│   ├── / ─────────────────── 랜딩 페이지 (홈)
│   ├── /blog ────────────── 블로그 목록
│   │   └── /blog/[slug] ── 블로그 상세
│   ├── /download ─────────── 서비스 소개서 다운로드 (리드 폼)
│   ├── /contact ──────────── 도입 문의
│   ├── /trial ────────────── AI 면접 무료 체험
│   ├── /privacy ──────────── 개인정보처리방침
│   ├── /terms-enterprise ── 기업용 이용약관
│   └── /terms-candidate ─── 지원자용 이용약관
│
├── 🔐 Admin Pages (인증 필요)
│   ├── /admin/login ──────── 관리자 로그인
│   ├── /admin ────────────── 대시보드
│   ├── /admin/blog ────────── 블로그 관리
│   │   ├── /admin/blog/new ─ 새 글 작성 (리치 에디터)
│   │   └── /admin/blog/[id] ─ 글 수정
│   ├── /admin/terms ──────── 약관 관리
│   │   ├── /admin/terms/new ─ 새 약관 작성
│   │   └── /admin/terms/[id] 약관 수정
│   ├── /admin/inquiries ──── 도입 문의 리스트
│   └── /admin/downloads ──── 소개서 다운로드 리스트
│
└── 🤖 AI 면접 서비스 (별도 앱 or 임베드)
    ├── 채용공고 × 이력서 분석
    ├── 역량 기준 추천
    ├── 검증 질문 추천
    ├── 실시간 AI 면접 (코비)
    └── AI 면접 리포트
```

---

## 3. 페이지별 상세 설계

### 3.1 랜딩 페이지 (/)

> 목표: 제품 가치 전달 → 도입 문의 / 소개서 다운 / 무료 체험 유도

**섹션 구성 (스크롤 스토리텔링)**

| # | 섹션 | 내용 | CTA |
|---|------|------|-----|
| 1 | Hero | "코비가 채용의 모든 과정을 자동화합니다" + 핵심 지표 3개 | 도입 문의 / 무료 체험 |
| 2 | Pain Points | HR 담당자의 3가지 고충 (시간, 일관성, 미스매칭) | — |
| 3 | Solution Bridge | "채용공고 하나로, 면접 설계부터 평가까지" | — |
| 4 | 코비 소개 | AI Screening Agent 코비의 역할과 특징 소개 | 무료 체험 |
| 5 | 핵심 기능 | 4단계 기능 (역량추출→질문설계→실시간면접→리포트) | — |
| 6 | 작동 방식 | 5스텝 타임라인 (셋업 10분) | — |
| 7 | AI 면접 서비스 상세 | 채용공고×이력서 분석, Deep dive, Proctoring, 리포트 | 소개서 다운 |
| 8 | 지원자 경험 | 공정한 면접, 다국어, 멀티 디바이스 | — |
| 9 | 성과 데이터 | 60일→2일, 5배 합격률, 90% 비용 절감 | — |
| 10 | 고객 사례 | 100+ 기업 로고 + 추천사 | — |
| 11 | 보안 & 연동 | ISO 27001, API, ATS, 커스터마이징 | — |
| 12 | 도입 문의 CTA | 폼 (회사명, 이름, 이메일, 규모) | 데모 신청 |

**디자인 참고 (Maki People 벤치마킹)**
- 깔끔한 화이트 기반 + 포인트 컬러
- Hero에 제품 데모 영상 또는 인터랙티브 데모
- 섹션 간 자연스러운 전환 애니메이션
- 코비 캐릭터/아이콘을 전략적으로 배치
- Floating CTA (모바일)

### 3.2 블로그 (/blog)

> 목표: SEO 유입 → 전문성 확보 → 전환 유도

**목록 페이지**
- 카드형 레이아웃 (그리드 3열 → 모바일 1열)
- 카드: 썸네일 + 카테고리 태그 + 제목 + 발행일 + 읽기 시간
- 카테고리 필터: 전체 / AI 채용 / HR 인사이트 / 고객 사례 / 제품 업데이트
- 페이지네이션 or 무한 스크롤

**상세 페이지**
- 본문: 리치 텍스트 (이미지, 테이블, 코드블록, 임베드 지원)
- 사이드: TOC (목차), CTA 배너 (도입 문의)
- 하단: 관련 글 추천, 소셜 공유 버튼

### 3.3 서비스 소개서 다운로드 (/download)

> 목표: 리드 정보 수집 → 소개서 PDF 전달

**페이지 구성**
- 좌측: 소개서 미리보기 (PDF 썸네일 or 주요 페이지 이미지)
- 우측: 리드 수집 폼
  - 회사명 (필수)
  - 담당자 이름 (필수)
  - 이메일 (필수)
  - 직책 (선택)
  - 전화번호 (선택)
  - 관심 분야 (선택, 멀티셀렉트: AI 면접, 채용 자동화, 역량 평가 등)
- 제출 후: 이메일 발송 + 즉시 다운로드 링크 제공
- 감사 페이지 (/download/thank-you)

### 3.4 도입 문의 (/contact)

> 목표: 영업 리드 수집

**폼 필드**
- 회사명 (필수)
- 담당자 이름 (필수)
- 이메일 (필수)
- 전화번호 (필수)
- 직책 (선택)
- 월 평균 채용 규모 (선택: 1~10명, 11~50명, 51~100명, 100명 이상)
- 관심 서비스 (멀티셀렉트: AI 면접, 역량 분석, ATS 연동, 기타)
- 문의 내용 (textarea)
- 개인정보 수집 동의 체크박스

**제출 후**
- DB 저장 + 관리자 이메일 알림
- 감사 메시지 표시
- "1영업일 내 답변드리겠습니다"

### 3.5 AI 면접 무료 체험 (/trial)

> 목표: 직접 체험을 통한 전환

**페이지 구성**
- 상단: "코비와 3분 면접을 체험해보세요" + 설명
- 체험 방식 선택:
  - A) 간단 체험: 사전 설정된 질문 3개로 즉시 시작 (회원가입 불필요)
  - B) 맞춤 체험: 직무/채용공고 입력 후 맞춤 면접 (간단 회원가입 필요)
- 체험 중: 코비와 실시간 대화 인터페이스
- 체험 후: 간단 리포트 미리보기 + "정식 서비스에서는 이런 분석까지" + CTA

💡 초기에는 외부 면접 서비스로 리다이렉트하거나, 데모 영상으로 대체 가능

---

## 4. 관리자 패널 상세 설계

### 4.1 로그인 (/admin/login)

- 이메일 + 비밀번호 인증
- NextAuth.js 기반 세션 관리
- 초기 관리자 계정은 시드 데이터로 생성

### 4.2 대시보드 (/admin)

| 위젯 | 내용 |
|------|------|
| 문의 현황 | 신규 문의 수, 최근 7일 추이 |
| 다운로드 현황 | 소개서 다운로드 수, 최근 7일 추이 |
| 블로그 현황 | 총 게시글 수, 최근 발행일 |
| 빠른 액션 | 새 글 쓰기, 문의 확인, 약관 관리 |

### 4.3 블로그 관리 (/admin/blog)

**목록**
- 테이블: 제목 | 카테고리 | 상태(발행/초안) | 발행일 | 액션(수정/삭제)
- 필터: 상태, 카테고리
- 검색: 제목 키워드

**에디터 (/admin/blog/new, /admin/blog/[id])**
- 리치 텍스트 에디터 (Tiptap 기반)
  - 제목 (H1~H3)
  - 본문 서식 (Bold, Italic, 링크, 인용)
  - 이미지 삽입 (업로드 → Vercel Blob or S3)
  - 테이블 삽입/편집
  - 코드 블록
  - 임베드 (YouTube 등)
- 메타 정보:
  - 슬러그 (자동 생성 + 수정 가능)
  - 카테고리 선택
  - 태그 (자유 입력)
  - 썸네일 이미지
  - SEO: meta title, meta description
  - 발행 상태: 초안 / 발행
  - 발행 예약일

### 4.4 약관 관리 (/admin/terms)

**목록**
- 테이블: 약관명 | 유형(개인정보/기업용/지원자용/기타) | 버전 | 상태(활성/비활성) | 최종 수정일
- "새 약관 작성" 버튼

**에디터**
- 약관명 입력
- 유형 선택 (드롭다운)
- 버전 (자동 증가 or 수동)
- 시행일 (날짜 선택)
- 리치 텍스트 에디터 (블로그와 동일)
- 활성화 토글: ON 시 공개 페이지에 반영
  - 동일 유형의 이전 약관은 자동 비활성화

### 4.5 도입 문의 리스트 (/admin/inquiries)

**테이블**
- 회사명 | 담당자 | 이메일 | 전화번호 | 채용규모 | 문의일 | 상태(신규/확인/처리완료)
- 상태 변경 (드롭다운)
- 상세 보기 모달: 문의 내용 전문 + 메모 작성
- CSV 내보내기

### 4.6 소개서 다운로드 리스트 (/admin/downloads)

**테이블**
- 회사명 | 담당자 | 이메일 | 직책 | 관심분야 | 다운로드일
- CSV 내보내기

---

## 5. AI 면접 서비스 기능 상세

### 5.1 채용공고 분석

```
[채용공고 입력] → AI 분석 → [결과]
  ├── 직무 요약
  ├── 핵심 역량 추출 (Hard Skills + Soft Skills)
  ├── 역량별 가중치 제안
  └── 업계/직무 벤치마크 비교
```

### 5.2 채용공고 × 이력서 분석

```
[채용공고 + 이력서 업로드] → AI 교차 분석 → [결과]
  ├── 이력서-공고 매칭도 (점수)
  ├── 강점/약점 분석
  ├── 추가 검증이 필요한 영역
  └── 맞춤 면접 질문 제안
```

### 5.3 역량 기준 추천
- 채용공고에서 자동 추출한 역량을 기반으로
- 직무/산업별 표준 역량 프레임워크 참조
- 고객사가 역량 가중치 커스터마이징 가능

### 5.4 검증 질문 추천
- 역량별 맞춤 질문 자동 생성
- 질문 유형: 행동 기반(STAR) / 상황 기반 / 기술 검증
- 난이도 조절 가능
- 고객사 질문 추가/수정 가능

### 5.5 실시간 AI 면접 (코비)

**면접 진행 방식**
- 웹 / 모바일 지원
- 영상(비디오) 면접: AI 코비와 음성 대 음성 대화
- 실시간 Deep Dive (꼬리물기 질문): 답변 분석 → 즉석 후속 질문
- 다국어 지원: 한국어, 영어, 베트남어, 아랍어

**커스터마이징**
- 면접 시간 제한 설정
- 질문 수/유형 선택
- 인사 메시지, 마감 메시지 커스터마이징
- 리포트 컬러/로고 커스터마이징
- 이력서 분석 포함 여부

### 5.6 Proctoring (부정행위 감지)
- 화면 이탈 감지
- 다중 인물 감지 (얼굴 인식)
- 마우스/탭 이동 감지
- 부정행위 리스크 레벨 표시 (Low / Medium / High)

### 5.7 AI 면접 리포트

| 리포트 섹션 | 내용 |
|------------|------|
| 종합 점수 | 역량별 점수 + 총점 |
| 역량 분석 | 각 역량별 상세 평가 + 근거 인용 |
| 리스크 분석 | 부정행위 감지 결과, 답변 일관성, 이상 패턴 |
| 추가 확인 질문 | 2차 면접에서 추가로 확인할 사항 |
| 면접 영상 & 스크립트 | 전체 면접 녹화 재생 + 텍스트 트랜스크립트 |
| 이력서 매칭 | 채용공고 대비 이력서 적합도 (이력서 분석 옵션 선택 시) |

---

## 6. 기술 스택

### 6.1 프론트엔드 + 백엔드

| 기술 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | **Next.js 14+ (App Router)** | SSR/SSG 혼합, API Routes, 풀스택 |
| 스타일링 | **Tailwind CSS** | 빠른 개발, 일관된 디자인 시스템 |
| UI 컴포넌트 | **shadcn/ui** | 접근성 보장, 커스터마이징 용이 |
| 리치 에디터 | **Tiptap** | 확장 가능, 이미지/테이블 지원 |
| 폼 처리 | **React Hook Form + Zod** | 타입 안전한 폼 검증 |
| 인증 | **NextAuth.js (Auth.js)** | 간편 세션 관리, 확장 가능 |
| 상태 관리 | **Zustand** (필요 시) | 경량, 간단 |

### 6.2 데이터베이스 & 인프라

| 기술 | 선택 | 이유 |
|------|------|------|
| DB | **PostgreSQL (Supabase)** | 무료 티어, 실시간, Auth 내장 |
| ORM | **Prisma** | 타입 안전, 마이그레이션 관리 |
| 파일 저장 | **Vercel Blob** or **Supabase Storage** | 이미지, PDF 업로드 |
| 배포 | **Vercel** | Next.js 최적화, 자동 배포 |
| 이메일 | **Resend** or **Nodemailer** | 문의 알림, 소개서 발송 |
| 분석 | **Vercel Analytics** + **Google Analytics** | 트래픽, 전환 추적 |

### 6.3 디렉토리 구조 (Next.js App Router)

```
ai-interviewer-web/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 랜딩 페이지
│   ├── blog/
│   │   ├── page.tsx            # 블로그 목록
│   │   └── [slug]/page.tsx     # 블로그 상세
│   ├── download/
│   │   ├── page.tsx            # 소개서 다운로드
│   │   └── thank-you/page.tsx
│   ├── contact/page.tsx        # 도입 문의
│   ├── trial/page.tsx          # 무료 체험
│   ├── privacy/page.tsx        # 개인정보처리방침
│   ├── terms-enterprise/page.tsx
│   ├── terms-candidate/page.tsx
│   ├── admin/
│   │   ├── layout.tsx          # 관리자 레이아웃 (사이드바)
│   │   ├── page.tsx            # 대시보드
│   │   ├── login/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx        # 블로그 관리 목록
│   │   │   ├── new/page.tsx    # 새 글 작성
│   │   │   └── [id]/page.tsx   # 글 수정
│   │   ├── terms/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── inquiries/page.tsx
│   │   └── downloads/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── blog/route.ts
│       ├── blog/[id]/route.ts
│       ├── terms/route.ts
│       ├── inquiries/route.ts
│       ├── downloads/route.ts
│       └── upload/route.ts
├── components/
│   ├── ui/                     # shadcn/ui 컴포넌트
│   ├── layout/                 # Header, Footer, Sidebar
│   ├── landing/                # 랜딩 섹션 컴포넌트
│   ├── blog/                   # 블로그 관련
│   ├── admin/                  # 관리자 관련
│   └── shared/                 # 공통 (CTA, Form, Modal 등)
├── lib/
│   ├── prisma.ts              # Prisma 클라이언트
│   ├── auth.ts                # NextAuth 설정
│   ├── utils.ts               # 유틸리티
│   └── validations.ts         # Zod 스키마
├── prisma/
│   ├── schema.prisma          # DB 스키마
│   └── seed.ts                # 시드 데이터
├── public/
│   ├── images/
│   └── files/                 # 소개서 PDF 등
├── styles/
│   └── globals.css            # Tailwind 기본
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 7. 데이터베이스 스키마

### 7.1 ERD 개요

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   AdminUser  │     │  BlogPost   │     │    Terms     │
├─────────────┤     ├─────────────┤     ├──────────────┤
│ id           │     │ id           │     │ id            │
│ email        │     │ title        │     │ title         │
│ passwordHash │     │ slug         │     │ type          │
│ name         │     │ content (JSON)│    │ content (JSON)│
│ role         │     │ excerpt      │     │ version       │
│ createdAt    │     │ thumbnail    │     │ effectiveDate │
│ updatedAt    │     │ category     │     │ isActive      │
└─────────────┘     │ tags         │     │ createdAt     │
                    │ status       │     │ updatedAt     │
                    │ publishedAt  │     └──────────────┘
                    │ seoTitle     │
                    │ seoDesc      │
                    │ authorId FK  │
                    │ createdAt    │
                    │ updatedAt    │
                    └─────────────┘

┌──────────────┐     ┌──────────────────┐
│   Inquiry    │     │   Download       │
├──────────────┤     ├──────────────────┤
│ id            │     │ id                │
│ company       │     │ company           │
│ name          │     │ name              │
│ email         │     │ email             │
│ phone         │     │ jobTitle          │
│ jobTitle      │     │ phone             │
│ hireSize      │     │ interests         │
│ interests     │     │ downloadedAt      │
│ message       │     │ createdAt         │
│ privacyAgreed │     └──────────────────┘
│ status        │
│ adminNote     │
│ createdAt     │
│ updatedAt     │
└──────────────┘
```

### 7.2 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── 관리자 ───
model AdminUser {
  id           String     @id @default(cuid())
  email        String     @unique
  passwordHash String
  name         String
  role         AdminRole  @default(EDITOR)
  blogPosts    BlogPost[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}

enum AdminRole {
  SUPER_ADMIN
  EDITOR
}

// ─── 블로그 ───
model BlogPost {
  id          String       @id @default(cuid())
  title       String
  slug        String       @unique
  content     Json         // Tiptap JSON
  excerpt     String?      @db.Text
  thumbnail   String?      // 이미지 URL
  category    BlogCategory @default(INSIGHT)
  tags        String[]     // 태그 배열
  status      PostStatus   @default(DRAFT)
  publishedAt DateTime?
  seoTitle    String?
  seoDesc     String?      @db.Text
  author      AdminUser    @relation(fields: [authorId], references: [id])
  authorId    String
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@index([slug])
  @@index([status, publishedAt])
  @@index([category])
}

enum BlogCategory {
  AI_HIRING      // AI 채용
  INSIGHT        // HR 인사이트
  CASE_STUDY     // 고객 사례
  PRODUCT_UPDATE // 제품 업데이트
}

enum PostStatus {
  DRAFT
  PUBLISHED
}

// ─── 약관 ───
model Terms {
  id            String     @id @default(cuid())
  title         String
  type          TermsType
  content       Json       // Tiptap JSON
  version       String     @default("1.0")
  effectiveDate DateTime
  isActive      Boolean    @default(false)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@index([type, isActive])
}

enum TermsType {
  PRIVACY         // 개인정보처리방침
  ENTERPRISE      // 기업용 이용약관
  CANDIDATE       // 지원자용 이용약관
  MARKETING       // 마케팅 동의
}

// ─── 도입 문의 ───
model Inquiry {
  id            String        @id @default(cuid())
  company       String
  name          String
  email         String
  phone         String
  jobTitle      String?
  hireSize      String?
  interests     String[]
  message       String?       @db.Text
  privacyAgreed Boolean       @default(true)
  status        InquiryStatus @default(NEW)
  adminNote     String?       @db.Text
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([status])
  @@index([createdAt])
}

enum InquiryStatus {
  NEW
  REVIEWED
  CONTACTED
  COMPLETED
}

// ─── 소개서 다운로드 ───
model Download {
  id        String   @id @default(cuid())
  company   String
  name      String
  email     String
  jobTitle  String?
  phone     String?
  interests String[]
  createdAt DateTime @default(now())

  @@index([createdAt])
}
```

---

## 8. API 설계

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | /api/auth/[...nextauth] | NextAuth 인증 | — |
| GET | /api/blog | 블로그 목록 (공개) | ❌ |
| GET | /api/blog/[slug] | 블로그 상세 (공개) | ❌ |
| POST | /api/blog | 블로그 생성 | ✅ Admin |
| PUT | /api/blog/[id] | 블로그 수정 | ✅ Admin |
| DELETE | /api/blog/[id] | 블로그 삭제 | ✅ Admin |
| GET | /api/terms | 약관 목록 | ✅ Admin |
| GET | /api/terms/active/[type] | 활성 약관 조회 (공개) | ❌ |
| POST | /api/terms | 약관 생성 | ✅ Admin |
| PUT | /api/terms/[id] | 약관 수정 | ✅ Admin |
| PATCH | /api/terms/[id]/activate | 약관 활성화 | ✅ Admin |
| GET | /api/inquiries | 문의 목록 | ✅ Admin |
| POST | /api/inquiries | 문의 제출 (공개) | ❌ |
| PATCH | /api/inquiries/[id] | 문의 상태 변경 | ✅ Admin |
| GET | /api/downloads | 다운로드 목록 | ✅ Admin |
| POST | /api/downloads | 다운로드 등록 (공개) | ❌ |
| POST | /api/upload | 이미지 업로드 | ✅ Admin |
| GET | /api/admin/stats | 대시보드 통계 | ✅ Admin |

---

## 9. 디자인 시스템

### 9.1 컬러 팔레트

| 용도 | 변수 | 값 | 비고 |
|------|------|---|------|
| 브랜드 Primary | --primary | #2563EB | CTA, 링크, 강조 |
| Primary Hover | --primary-hover | #1D4ED8 | 호버 상태 |
| Primary Light | --primary-light | #DBEAFE | 배지, 하이라이트 |
| 배경 | --bg | #FFFFFF | 기본 배경 |
| 배경 대체 | --bg-alt | #F8F9FA | 섹션 교차 배경 |
| 배경 다크 | --bg-dark | #1A1A2E | 다크 섹션, 푸터 |
| 텍스트 | --text | #1E2229 | 본문 |
| 텍스트 보조 | --text-sub | #6B7280 | 부가 설명 |
| 테두리 | --border | #E5E7EB | 카드, 구분선 |
| 성공 | --success | #10B981 | 성공 상태 |
| 경고 | --warning | #F59E0B | 경고 상태 |
| 에러 | --error | #EF4444 | 오류 상태 |

### 9.2 타이포그래피

| 요소 | 크기 | 가중치 | 비고 |
|------|------|--------|------|
| Display (Hero) | 56px → 32px (모바일) | 700 | 랜딩 Hero |
| H1 | 44px → 28px | 700 | 섹션 타이틀 |
| H2 | 28px → 22px | 700 | 서브 타이틀 |
| H3 | 20px → 18px | 600 | 카드 타이틀 |
| Body | 16px | 400 | 본문 |
| Body Small | 14px | 400 | 부가 텍스트 |
| Caption | 12~13px | 500 | 태그, 레이블 |

- **폰트**: Pretendard (한국어 최적화 산세리프)

### 9.3 반응형 브레이크포인트

| 이름 | 범위 | Tailwind |
|------|------|----------|
| Mobile | ~640px | sm: |
| Tablet | 641~1024px | md:, lg: |
| Desktop | 1025px~ | xl:, 2xl: |

---

## 10. 개발 마일스톤

### Phase 1: 기반 구축 (1주차)
- [ ] Next.js 프로젝트 초기 설정
- [ ] Prisma + Supabase DB 연결
- [ ] NextAuth 인증 구현
- [ ] 디자인 시스템 (Tailwind + shadcn/ui 설정)
- [ ] 공통 레이아웃 (Header, Footer, Admin Sidebar)

### Phase 2: 공개 페이지 (2주차)
- [ ] 랜딩 페이지 (모든 섹션)
- [ ] 도입 문의 페이지 + API
- [ ] 서비스 소개서 다운로드 페이지 + API
- [ ] 약관 페이지 (DB에서 동적 로딩)
- [ ] SEO 메타 태그, sitemap.xml

### Phase 3: 관리자 패널 (3주차)
- [ ] 관리자 대시보드
- [ ] 블로그 CRUD + 리치 에디터 (Tiptap)
- [ ] 약관 CRUD + 활성화 관리
- [ ] 도입 문의 리스트 + 상태 관리
- [ ] 다운로드 리스트
- [ ] 이미지 업로드 기능

### Phase 4: 블로그 & 체험 (4주차)
- [ ] 블로그 목록/상세 페이지 (SSG)
- [ ] AI 면접 무료 체험 페이지
- [ ] 반응형 최적화 & 크로스 브라우저 테스트
- [ ] 성능 최적화 (Core Web Vitals)
- [ ] Vercel 배포 + 도메인 연결

### Phase 5: 고도화 (이후)
- [ ] AI 면접 서비스 실제 연동 (채용공고 분석, 코비 면접)
- [ ] 다국어 지원 (i18n)
- [ ] A/B 테스트 설정
- [ ] 이메일 자동화 (Resend)
- [ ] Analytics 대시보드

---

## 11. Maki People 벤치마킹 요약

### 참고할 점

| 영역 | Maki People | 슈퍼코더 적용 |
|------|------------|-------------|
| AI Agent 네이밍 | "Mochi" (스크리닝 에이전트) | "코비 (Kobi)" |
| 핵심 메시지 | "Scale hiring perfectly" | "코비가 채용의 모든 과정을 자동화합니다" |
| 평가 역량 | 300+ 스킬 평가 | 채용공고 기반 맞춤 역량 추출 |
| 면접 형태 | Phone/Video/Voice/Text | 비디오 면접 (음성 대화형) |
| 프록터링 | 30초마다 사진, 다중 인물 감지 | 화면 이탈 + 다중 인물 + 마우스 감지 |
| 편향 제거 | Bias-mitigated signals, auditable | 구조화된 면접으로 일관성 보장 |
| 성과 지표 | 90% 시간 절감, 50% 채용기간 단축 | 60일→2일, 5배 합격률, 90% 비용 절감 |
| ATS 연동 | 30+ ATS/HR 시스템 | API 제공, ATS 연동 준비 중 |
| 후보자 만족도 | 8.7/10 | 측정 예정 |

### 차별화 포인트

1. **한국 시장 특화**: 한국어 최적화, 국내 기업 레퍼런스 (현대오토에버, 카카오페이)
2. **면접 설계 자동화**: 채용공고만으로 전체 면접 프로세스 자동 설계 (경쟁사 대비 독보적)
3. **이력서 × 채용공고 교차 분석**: 단순 스크리닝이 아닌 심층 매칭
4. **실시간 Deep Dive**: 답변 기반 실시간 꼬리질문으로 구조화 면접의 깊이

---

## 12. 주의사항 및 제약

1. AI 면접 서비스 자체 (영상 면접, 음성 인식 등)는 별도 백엔드 시스템 — 웹사이트에서는 체험 데모 또는 외부 연결로 처리
2. 초기 버전에서는 블로그/약관의 실시간 미리보기(프리뷰) 기능은 심플하게 구현
3. 이미지 업로드는 Vercel Blob 무료 티어(500MB) 내에서 운영, 초과 시 S3 전환 검토
4. 관리자 계정은 초대 기반 (셀프 회원가입 불가)
5. 약관 활성화 시 이전 버전은 자동 비활성화되지만, 이력은 보존

---

*이 문서를 기반으로 합의된 후, Phase 1부터 순차적으로 개발을 시작합니다.*
