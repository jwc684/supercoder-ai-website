# Vercel 배포 가이드

본 가이드는 **슈퍼코더 AI Interviewer 웹사이트**를 Vercel 에 배포하는
Step-by-step 절차를 다룹니다. Supabase 프로젝트는 이미 존재한다고 가정합니다.

---

## 1. 사전 준비 체크리스트

- [ ] **GitHub 저장소**: `https://github.com/jwc684/supercoder-ai-website` 에
      최신 커밋이 푸시되어 있음 (`main` 브랜치)
- [ ] **Supabase 프로젝트**: 프로덕션 데이터베이스가 준비됨
- [ ] **Supabase Storage 버킷** 2개가 생성되어 있음 (아래 스크립트 실행)
  - `blog-images` (public, 5MB, image/* MIME)
  - `brochures` (public, 20MB, application/pdf)
- [ ] **초기 관리자 계정** (Supabase Auth) 1개 이상 생성됨
- [ ] **Vercel 계정** — `vercel.com` 로그인 가능

로컬에서 버킷이 아직 없다면:

```bash
npx dotenv -e .env.local -- node scripts/setup-storage.mjs
npx dotenv -e .env.local -- node scripts/setup-brochures-bucket.mjs
```

---

## 2. Vercel 프로젝트 생성

1. [vercel.com/new](https://vercel.com/new) 접속
2. **Import Git Repository** → `jwc684/supercoder-ai-website` 선택
3. **Configure Project** 화면:
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `vercel.json` 의 `buildCommand` 가 사용됨
     → `prisma generate && prisma migrate deploy && next build`
   - **Output Directory**: `.next` (자동)
   - **Install Command**: `npm install` (자동, postinstall 로 `prisma generate`)

**참고**: 로컬 개발에선 `npm run build` 가 `prisma generate && next build`
만 실행합니다 (로컬엔 `.env.local` 이 prisma CLI 에 자동 로드되지 않아
`migrate deploy` 는 수동으로 `npm run db:migrate:deploy` 로 실행).
Vercel 에선 `vercel.json` 의 `buildCommand` 가 `package.json` 보다 우선해서
마이그레이션이 자동 적용됩니다.

---

## 3. 환경 변수 주입 (Environment Variables)

Vercel 프로젝트 설정 → **Environment Variables** 에 다음 5 개를 Production 및
Preview 양쪽에 추가:

| Key | 값 | 노트 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` | Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_xxx` | 브라우저 노출 가능 |
| `SUPABASE_SECRET_KEY` | `sb_secret_xxx` | **서버 전용**, Production/Preview 만 |
| `DATABASE_URL` | Supabase Transaction pooler (port 6543) | `pgbouncer=true&connection_limit=1` 쿼리 필수 |
| `DIRECT_URL` | Supabase Session/Direct (port 5432) | Prisma 마이그레이션이 사용 |
| `NEXT_PUBLIC_SITE_URL` | `https://www.supercoder.ai` (실제 도메인) | sitemap/robots/OG baseURL |

**중요**:
- `SUPABASE_SECRET_KEY` 는 **Development 스코프에 넣지 말 것** (서버 로그 유출
  위험). Production + Preview 만 체크.
- `DATABASE_URL` 은 반드시 pooler (6543) 를 사용해야 서버리스 함수의 콜드 스타트
  성능 및 connection 한계를 피합니다.
- `DIRECT_URL` 은 마이그레이션 적용용으로만 빌드 중에 쓰이며, pgbouncer 우회가
  필수이므로 5432 direct 포트를 사용합니다.

---

## 4. 초기 배포 (Deploy)

1. **Deploy** 버튼 클릭 → 첫 빌드 시작
2. 빌드 로그에서 확인할 것:
   ```
   ✓ prisma generate (postinstall)
   ✓ prisma generate (build step 1)
   ✓ prisma migrate deploy — Applied N migrations
   ✓ next build — 컴파일 성공
   ```
3. 빌드가 성공하면 자동으로 Preview URL 이 생성됨
   (예: `supercoder-ai-website-xxx.vercel.app`)

### 빌드 실패 시 자주 보는 에러

| 증상 | 원인 | 해결 |
|---|---|---|
| `Can't reach database server at aws-*.pooler...` | `DATABASE_URL`/`DIRECT_URL` 틀림 | Supabase 대시보드 Settings → Database 에서 연결 문자열 재확인 |
| `Migration failed: relation "..." already exists` | 수동으로 테이블을 만든 뒤 마이그레이션 충돌 | Supabase 에서 테이블 drop 후 재배포, 또는 `_prisma_migrations` 테이블 정리 |
| `PrismaClientInitializationError` | `postinstall`/`build` 의 `prisma generate` 누락 | package.json 스크립트 확인 |
| `Environment variable not found: SUPABASE_SECRET_KEY` | 변수명 오타 또는 스코프 미체크 | Production 스코프에 존재하는지 확인 |

---

## 5. 프로덕션 프로모션

1. Preview 에서 동작 확인:
   - `/` 홈 페이지
   - `/blog`, `/blog/[slug]` (블로그가 있으면)
   - `/contact`, `/download`, `/trial`
   - `/admin/login` → 로그인 → `/admin` 대시보드
2. Deployments 탭 → 해당 배포 → **"Promote to Production"**
3. 프로덕션 도메인 확인

---

## 6. 커스텀 도메인 연결 (선택)

1. Vercel 프로젝트 → Settings → **Domains**
2. `www.supercoder.ai` 등 원하는 도메인 입력 → Add
3. DNS 제공자에서 Vercel 이 안내하는 CNAME/A 레코드 추가
4. SSL 자동 발급 대기 (수 분 내)
5. **도메인 연결 후** `NEXT_PUBLIC_SITE_URL` 값을 해당 도메인으로 갱신 후 재배포
   (sitemap/robots/OG 의 baseURL 에 반영됨)

---

## 7. 배포 후 검증 체크리스트

- [ ] `/` 홈 200 + FAQ 섹션 렌더 (공개 FAQ 가 있을 때)
- [ ] `/blog` 200 + 카드 그리드 + 페이지네이션
- [ ] `/blog/[slug]` 200 + 본문 + TOC
- [ ] `/contact` 제출 → Supabase `inquiries` 테이블에 레코드 생성 확인
- [ ] `/download` 제출 → 응답 `downloadUrl` 로 Supabase Storage PDF 다운로드
- [ ] `/sitemap.xml` 200 + 블로그 slug 포함 확인
- [ ] `/robots.txt` 200 + `/admin`, `/api` disallow 확인
- [ ] `/admin/login` 로그인 → `/admin` 대시보드 표시
- [ ] `/admin/blog/new` 에서 글 작성 → 저장 → 목록 조회
- [ ] `/admin/brochure` 에서 PDF 업로드 → `/download` 제출 시 새 URL 반환 확인
- [ ] Vercel Analytics 대시보드에서 방문자 기록 시작

---

## 8. 운영 노트

### Prisma 마이그레이션 워크플로우

- **개발 중**: `npm run db:migrate -- --name <desc>` 로 로컬에서 스키마 변경
  + 마이그레이션 파일 생성
- **푸시 후**: Vercel 빌드가 자동으로 `prisma migrate deploy` 실행 →
  프로덕션 DB 에 pending 마이그레이션 적용
- **롤백**: 마이그레이션은 forward-only. 되돌리려면 새 migration 을 작성해서
  되돌리는 방향으로 정의

### Supabase Storage 버킷

로컬에선 `setup-*-bucket.mjs` 스크립트로 생성하지만, **프로덕션 Supabase 에도
같은 버킷이 존재**해야 합니다. 다음 중 하나의 방법:

1. **수동**: Supabase 대시보드 Storage 에서 각 버킷 생성
2. **스크립트**: 프로덕션 `.env` 를 잠시 로컬에 복사 후
   `node scripts/setup-storage.mjs` / `setup-brochures-bucket.mjs` 실행
3. **초기 시드 스크립트**: (추후) `postinstall` 또는 `build` 단계에서 자동 실행

### 환경 변수 변경 반영

Vercel 에서 환경 변수 변경 후에는 **재배포(Redeploy)** 를 트리거해야 새 값이
서버 함수에 주입됩니다. 설정만 바꾼다고 자동 적용되지 않습니다.

### 모니터링

- **Logs**: Vercel 프로젝트 → Logs 탭 → 서버 함수별 로그 스트림
- **Analytics**: Vercel 프로젝트 → Analytics 탭 → `@vercel/analytics` 가
  자동 수집
- **Database**: Supabase 대시보드 → Database → Query Performance 로 느린
  쿼리 추적
