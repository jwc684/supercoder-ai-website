/**
 * User-Agent 기반 디바이스 분류.
 *
 * 라이브러리 없이 regex 로 판별. GA4 와 유사한 정확도 (~95%).
 * tablet 은 iPad + Android tablet (UA 에 "Mobile" 없는 Android) + 기타 태블릿 키워드.
 * mobile 은 phone 계열.
 * 나머지는 desktop.
 */
export type DeviceType = "desktop" | "mobile" | "tablet";

export function detectDevice(ua: string): DeviceType {
  if (!ua) return "desktop";

  // tablet 먼저 체크 (iPad, Android 태블릿, 기타)
  if (/iPad|PlayBook|Silk/i.test(ua)) return "tablet";
  // Android + "Mobile" 없음 = tablet
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return "tablet";

  // mobile (phone)
  if (
    /Mobile|iPhone|iPod|Opera Mini|IEMobile|WPDesktop|BlackBerry|webOS/i.test(
      ua,
    )
  ) {
    return "mobile";
  }
  // Android + "Mobile" 있음 = phone
  if (/Android.*Mobile/i.test(ua)) return "mobile";

  return "desktop";
}
