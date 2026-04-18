// Google OAuth2 Refresh Token 발급 헬퍼 (1회용).
//
// 사용:
//   1) .env.local 에 GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET 설정
//   2) Google Cloud Console → Credentials → 해당 OAuth Client 의
//      Authorized redirect URIs 에 http://localhost:4444/oauth2callback 추가 → Save
//   3) node scripts/get-gmail-refresh-token.mjs
//   4) 터미널에 뜨는 URL 열어서 발신 계정 (예: noreply@supercoder.co) 으로 로그인 · 동의
//   5) 출력되는 refresh_token 값을 .env.local 의 GOOGLE_REFRESH_TOKEN 에 저장

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { URL } from "node:url";
import { google } from "googleapis";

// .env.local 수동 파싱 (dotenv 의존 없이 Node 로만).
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, "utf-8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2];
    if (
      (v.startsWith("\"") && v.endsWith("\"")) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    process.env[m[1]] ??= v;
  }
}

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID?.trim();
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET?.trim();
const REDIRECT_URI = "http://localhost:4444/oauth2callback";
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
const PORT = 4444;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "❌ .env.local 에 GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET 를 먼저 설정해주세요.",
  );
  process.exit(1);
}

const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2.generateAuthUrl({
  access_type: "offline", // refresh_token 받기 위해 필수
  prompt: "consent", // 매번 refresh_token 을 강제로 새로 발급
  scope: SCOPES,
});

console.log("\n1️⃣  아래 URL 을 브라우저에서 여세요:\n");
console.log(`   ${authUrl}\n`);
console.log("2️⃣  발신할 Google 계정 (예: noreply@supercoder.co) 으로 로그인·동의하세요.");
console.log("3️⃣  리다이렉트되면 이 창에 토큰이 출력됩니다.\n");

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
    if (url.pathname !== "/oauth2callback") {
      res.writeHead(404).end("not found");
      return;
    }

    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    if (error) {
      res.writeHead(400).end(`OAuth error: ${error}`);
      console.error(`❌ OAuth 에러: ${error}`);
      server.close();
      return;
    }
    if (!code) {
      res.writeHead(400).end("missing code");
      return;
    }

    const { tokens } = await oauth2.getToken(code);

    if (!tokens.refresh_token) {
      res
        .writeHead(200, { "content-type": "text/plain; charset=utf-8" })
        .end(
          "refresh_token 이 발급되지 않았습니다. 이미 동의한 적 있는 계정이라면 https://myaccount.google.com/permissions 에서 해당 앱을 제거한 뒤 다시 시도하세요.",
        );
      console.error(
        "\n⚠️  refresh_token 이 응답에 없습니다. 기존 동의 이력이 있는 경우 Google 이 내려주지 않습니다.",
      );
      console.error(
        "   https://myaccount.google.com/permissions 에서 이 앱을 제거한 뒤 다시 실행해주세요.",
      );
      server.close();
      return;
    }

    res
      .writeHead(200, { "content-type": "text/plain; charset=utf-8" })
      .end("✅ 토큰 발급 완료. 이 창은 닫으셔도 됩니다.");

    // .env.local 자동 업데이트 — 기존 값이 있으면 교체, 없으면 추가.
    try {
      let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : "";
      const line = `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`;
      if (/^GOOGLE_REFRESH_TOKEN=.*$/m.test(env)) {
        env = env.replace(/^GOOGLE_REFRESH_TOKEN=.*$/m, line);
      } else {
        env += (env.endsWith("\n") || env.length === 0 ? "" : "\n") + line + "\n";
      }
      fs.writeFileSync(envPath, env);
      console.log("\n✅ Refresh Token 발급 완료 → .env.local 에 자동 저장됨\n");
      console.log(`   길이: ${tokens.refresh_token.length} 자`);
      console.log(`   prefix: ${tokens.refresh_token.slice(0, 6)}…`);
      console.log("\n이제 dev 서버를 다시 시작하시면 메일 발송이 동작합니다.");
    } catch (e) {
      console.error("⚠️  .env.local 자동 저장 실패 — 수동으로 복사해주세요:");
      console.log(`\n   GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
      console.error(e);
    }

    server.close();
  } catch (err) {
    console.error("토큰 교환 실패:", err);
    res.writeHead(500).end("server error");
    server.close();
  }
});

server.listen(PORT, () => {
  console.log(`🚀 대기 중 — http://localhost:${PORT}/oauth2callback\n`);
});
