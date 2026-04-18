import { google } from "googleapis";

/**
 * Gmail API 직접 호출 (OAuth2 User Credentials + Refresh Token).
 *
 * 필요 env:
 *   GMAIL_USER            — 발신 Gmail 주소 (OAuth 동의 시 로그인한 계정)
 *   GOOGLE_CLIENT_ID      — Google Cloud OAuth 2.0 Web Client ID
 *   GOOGLE_CLIENT_SECRET  — Google Cloud OAuth 2.0 Client Secret
 *   GOOGLE_REFRESH_TOKEN  — scripts/get-gmail-refresh-token.mjs 로 한 번 발급
 *   BROCHURE_FROM_NAME    — From 필드 표시 이름 (선택)
 *   BROCHURE_REPLY_TO     — Reply-To (선택, 기본은 GMAIL_USER)
 *
 * Access token 은 요청 시마다 googleapis 가 refresh_token 으로 자동 갱신.
 * OAuth consent screen 을 'In production' 으로 publish 하면 refresh_token 무기한 유효.
 * 'Testing' 상태에서는 7일마다 만료되므로 운영 배포 전 반드시 publish.
 */

type OAuth2Client = InstanceType<typeof google.auth.OAuth2>;
let cachedAuth: OAuth2Client | null = null;

function getAuth(): OAuth2Client {
  if (cachedAuth) return cachedAuth;

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN 환경변수가 설정되지 않았습니다.",
    );
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });
  cachedAuth = oauth2;
  return oauth2;
}

export type BrochureMailInput = {
  to: string;
  name: string;
  company: string;
  filename?: string;
  /** Download 레코드의 cuid — 트래킹 URL 구성에 사용 (click/open 프록시) */
  downloadId: string;
  /** 마케팅 수신 동의 여부 — footer 의 수신거부 문구 가시성 제어 */
  marketingOptIn?: boolean;
};

/**
 * 이메일에서 쓰이는 트래킹/CDN URL 의 원본 도메인.
 * Production 은 supercoder.co 고정. dev/preview 에서도 프록시 endpoint 는
 * 여기로 모아두어야 메일 클라이언트가 캐시한 이후에도 깨지지 않는다.
 */
const EMAIL_BASE_URL = "https://supercoder.co";
const EMAIL_LOGO_URL =
  "https://eifrhwclbojdrlxgwbzn.supabase.co/storage/v1/object/public/seo-images/email/logo-horizontal-email.png";

export async function sendBrochureEmail(input: BrochureMailInput): Promise<void> {
  const fromName = process.env.BROCHURE_FROM_NAME ?? "슈퍼코더 AI Interviewer";
  const fromEmail = process.env.GMAIL_USER!.trim();
  const replyTo = process.env.BROCHURE_REPLY_TO?.trim() || fromEmail;

  // 트래킹 URL 두 개 — click (파일 프록시) / open (1×1 픽셀)
  const clickUrl = `${EMAIL_BASE_URL}/api/downloads/${encodeURIComponent(input.downloadId)}/file`;
  const openUrl = `${EMAIL_BASE_URL}/api/downloads/${encodeURIComponent(input.downloadId)}/open`;

  const subject = "✉️ 신청하신 슈퍼코더 AI Interviewer 소개서를 보내드립니다";
  const text = buildPlainText({ ...input, clickUrl });
  const html = buildHtml({ ...input, fromName, clickUrl, openUrl });

  const raw = buildRawMime({
    fromName,
    fromEmail,
    to: input.to,
    replyTo,
    subject,
    text,
    html,
  });

  const auth = getAuth();
  const gmail = google.gmail({ version: "v1", auth });

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
}

// ─── MIME 빌더 ────────────────────────────────────────────────────
// Gmail API 의 users.messages.send 는 base64url 로 인코딩된 RFC 2822 메시지만 받는다.
// 한국어 subject 는 =?UTF-8?B?…?= Q-encoding, 본문은 multipart/alternative +
// base64 encoding 으로 안전하게 보낸다.
function buildRawMime(m: {
  fromName: string;
  fromEmail: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}): string {
  const boundary = `----=_Part_${Date.now().toString(16)}`;

  const lines = [
    `From: ${encodeHeaderWord(m.fromName)} <${m.fromEmail}>`,
    `To: ${m.to}`,
    `Reply-To: ${m.replyTo}`,
    `Subject: ${encodeHeaderWord(m.subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    base64Wrapped(m.text),
    "",
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    base64Wrapped(m.html),
    "",
    `--${boundary}--`,
    "",
  ];

  const mime = lines.join("\r\n");

  // Gmail API 는 base64url (표준 base64 에서 + → -, / → _, padding 제거) 요구.
  return Buffer.from(mime, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

/** base64 인코딩 결과를 76자 줄바꿈 (RFC 2045) */
function base64Wrapped(s: string): string {
  const b64 = Buffer.from(s, "utf-8").toString("base64");
  return b64.match(/.{1,76}/g)?.join("\r\n") ?? b64;
}

/**
 * RFC 2047 encoded-word — 헤더에 들어가는 비 ASCII 텍스트를 UTF-8 base64 로 감싼다.
 * From / Subject / To 의 display name 에 한국어·이모지가 포함돼 있을 때 필수.
 * ASCII 만 있을 땐 원문 그대로 (quote 감싸서) 반환해 호환성 유지.
 */
function encodeHeaderWord(s: string): string {
  if (!/[^\x20-\x7E]/.test(s)) {
    // ASCII only — display name 은 관례적으로 quote 로 감싼다 (공백·특수문자 대비).
    return `"${s.replace(/"/g, '\\"')}"`;
  }
  return `=?UTF-8?B?${Buffer.from(s, "utf-8").toString("base64")}?=`;
}

// ─── Feature sections (본문 스토리텔링 블록) ────────────────────────
const features: {
  q: string;
  solution: string;
  result: string;
}[] = [
  {
    q: "이력서가 사실인지 확인할 방법이 없고, 직무마다 '좋은 사람'의 기준이 달라서 혼자 정하기 어려우신가요?",
    solution:
      "슈퍼코더 AI Interviewer 가 채용공고(JD) 를 읽고 직무 역량을 자동 추출한 뒤, 이력서와 교차 비교합니다.",
    result:
      "HR 이 개발자·디자이너·세일즈 직무를 몰라도, AI 가 기준을 잡아 맞춤 질문까지 만들어 드립니다.",
  },
  {
    q: "면접 일정 조율·진행·평가 취합까지 전부 수작업이고, 현업 팀장들에게 면접관 교육을 따로 할 시간도 없다면?",
    solution:
      "AI 가 1차 면접 전체를 구조화된 질문과 실시간 꼬리 질문으로 자동 진행합니다.",
    result:
      "면접관 교육 없이 일관된 품질이 유지되고, 현업 팀장은 리포트만 보고 2차 면접 대상을 고르시면 됩니다.",
  },
  {
    q: "채용 과정이 블랙박스라 경영진에게 '왜 이 사람인가' 를 데이터로 설명하기 어려우신가요?",
    solution:
      "역량별 점수, 답변 근거 인용, 영상 타임라인까지 자동으로 리포트화됩니다.",
    result:
      "링크 한 장으로 경영진과 바로 공유 — 채용 결과를 근거 기반으로 보고하실 수 있습니다.",
  },
];

function buildPlainText(
  i: BrochureMailInput & { clickUrl: string },
): string {
  const lines: string[] = [
    `${i.name}님, 안녕하세요. 슈퍼코더 AI Interviewer 팀입니다.`,
    "",
    `신청하신 ${i.company} 담당자용 서비스 소개서를 아래 전달드립니다.`,
    "",
    `📄 소개서 확인하기: ${i.clickUrl}`,
    "",
    "슈퍼코더 AI Interviewer 는 채용의 모든 과정을 AI 로 구조화해, 채용팀의 판단이 데이터로 단단해지도록 돕습니다.",
    "",
  ];

  features.forEach((f) => {
    lines.push(f.q);
    lines.push(f.solution);
    lines.push(f.result);
    lines.push("");
  });

  lines.push(
    "귀사의 채용 문제, 슈퍼코더와 함께 해결하고 싶으시다면?",
    "아래 링크로 도입 문의를 남겨주세요: https://supercoder.co/contact",
    "",
    "감사합니다.",
    "슈퍼코더 AI Interviewer 팀 드림.",
    "",
    "──",
    "슈퍼코더 AI Interviewer",
    "sales@supercoder.co",
    "https://supercoder.co",
  );

  if (i.marketingOptIn) {
    lines.push(
      "",
      "※ 마케팅 정보 수신 동의를 해주셔서 신규 기능·이벤트 소식을 추가로 보내드릴 수 있습니다. 언제든 이 메일에 '수신거부' 라고 답장하시면 즉시 중단됩니다.",
    );
  }

  return lines.join("\n");
}

function buildHtml(
  i: BrochureMailInput & {
    fromName: string;
    clickUrl: string;
    openUrl: string;
  },
): string {
  const safeName = escapeHtml(i.name);
  const safeCompany = escapeHtml(i.company);
  const safeFile = escapeHtml(i.filename ?? "supercoder-brochure.pdf");
  const safeClickUrl = encodeURI(i.clickUrl);
  const safeOpenUrl = encodeURI(i.openUrl);
  // 이메일 본문 내 링크는 프로덕션 브랜드 도메인(.co) 으로 고정.
  const contactUrl = "https://supercoder.co/contact";

  const featureBlocks = features
    .map(
      (f) => `
        <tr>
          <td style="padding:24px 32px;border-top:1px solid #eef1f5;">
            <p style="margin:0 0 8px 0;font-size:14.5px;line-height:1.55;font-weight:600;color:#111827;">
              ${escapeHtml(f.q)}
            </p>
            <p style="margin:0 0 6px 0;font-size:14px;line-height:1.7;color:#374151;">
              ${escapeHtml(f.solution)}
            </p>
            <p style="margin:0;font-size:13.5px;line-height:1.7;color:#6b7280;">
              ${escapeHtml(f.result)}
            </p>
          </td>
        </tr>`,
    )
    .join("");

  const marketingFooter = i.marketingOptIn
    ? `<p style="margin:14px 0 0 0;font-size:11.5px;color:#9ca3af;line-height:1.6;">
         마케팅 정보 수신에 동의하신 경우에 한해 신규 기능·이벤트 소식을 추가로 보내드릴 수 있으며,
         이 메일에 <strong>'수신거부'</strong> 라고 답장하시면 즉시 중단됩니다.
       </p>`
    : `<p style="margin:14px 0 0 0;font-size:11.5px;color:#9ca3af;line-height:1.6;">
         마케팅 정보 수신에는 동의하지 않으셔서 본 소개서 메일 외 추가 발송은 이뤄지지 않습니다.
       </p>`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>슈퍼코더 AI Interviewer 서비스 소개서</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif;color:#282828;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:28px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 0 32px;">
              <img src="${EMAIL_LOGO_URL}"
                   alt="슈퍼코더"
                   width="160"
                   height="20"
                   style="display:block;height:20px;width:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 0 32px;">
              <p style="margin:0 0 6px 0;font-size:16px;line-height:1.6;color:#111827;">
                안녕하세요, ${safeName}님.
              </p>
              <p style="margin:0;font-size:14.5px;line-height:1.7;color:#374151;">
                신청하신 <strong style="color:#111827;">${safeCompany}</strong> 담당자용
                슈퍼코더 AI Interviewer 서비스 소개서를 아래 전달드립니다.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background:#2563eb;border-radius:10px;">
                    <a href="${safeClickUrl}"
                       style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                      📄 소개서 확인하기 →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:10px 0 0 0;font-size:12px;color:#9ca3af;">
                ${safeFile}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 4px 32px;">
              <p style="margin:0;font-size:14.5px;line-height:1.75;color:#374151;">
                슈퍼코더 AI Interviewer 는 채용의 모든 과정을 AI 로 구조화해,
                채용팀의 판단이 <strong style="color:#111827;">데이터로 단단해지도록</strong> 돕습니다.
              </p>
            </td>
          </tr>
          ${featureBlocks}
          <tr>
            <td style="padding:28px 32px 0 32px;border-top:1px solid #eef1f5;">
              <p style="margin:0 0 14px 0;font-size:14.5px;line-height:1.7;color:#374151;">
                귀사의 채용 문제, 슈퍼코더와 함께 해결하고 싶으시다면?<br/>
                아래 버튼을 눌러 도입 문의를 남겨주세요.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border:1px solid #2563eb;border-radius:10px;">
                    <a href="${contactUrl}"
                       style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#2563eb;text-decoration:none;">
                      도입 문의 남기기 →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <p style="margin:0;font-size:14px;line-height:1.7;color:#374151;">
                감사합니다.<br/>
                슈퍼코더 AI Interviewer 팀 드림.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px 32px;border-top:1px solid #eef1f5;">
              <p style="margin:0;font-size:12.5px;line-height:1.65;color:#6b7280;">
                <strong style="color:#111827;">슈퍼코더 AI Interviewer</strong><br/>
                sales@supercoder.co<br/>
                <a href="https://supercoder.co" style="color:#6b7280;text-decoration:underline;">supercoder.co</a>
              </p>
              ${marketingFooter}
            </td>
          </tr>
        </table>
        <p style="margin:14px 0 0 0;font-size:11px;color:#9ca3af;">
          이 메일은 귀하께서 supercoder.co 에서 서비스 소개서를 요청하셔서 발송되었습니다.
        </p>
      </td>
    </tr>
  </table>
  <!-- 트래킹 픽셀 — 수신자가 메일을 열면 Download.emailOpenCount 증가 -->
  <img src="${safeOpenUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;" />
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
