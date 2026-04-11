-- Stats 싱글톤 자동 생성
--
-- add_stats_counters 마이그레이션이 테이블만 만들고 row 는 안 넣었음.
-- Mutation API 들은 `prisma.stats.update({where:{id:"singleton"}})` 를 호출하므로
-- row 가 없으면 "Record to update not found" 에러로 insert 트랜잭션 전체 롤백.
--
-- 이 마이그레이션은 프로덕션/스테이징/로컬 어디서든 배포 시점에 자동 실행되어
-- 싱글톤 row 존재를 보장. 이미 있으면 DO NOTHING.
--
-- 초기값은 0. 실제 DB 값으로 동기화하려면 `npm run db:seed-stats` 실행.
INSERT INTO "stats" (
  "id",
  "inquiriesTotal",
  "inquiriesNew",
  "downloadsTotal",
  "blogPostsTotal",
  "blogPostsPublished",
  "pageViewsTotal",
  "updatedAt"
) VALUES (
  'singleton', 0, 0, 0, 0, 0, 0, NOW()
)
ON CONFLICT ("id") DO NOTHING;
