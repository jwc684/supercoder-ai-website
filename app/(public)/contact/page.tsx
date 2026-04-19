import { ContactForm } from "@/components/contact/ContactForm";
import { LogoMarquee } from "@/components/landing/LogoMarquee";

/**
 * /contact — 데모 신청 페이지 (server component).
 * 폼 로직은 ContactForm(client) 로 위임하고, 랜딩의 LogoMarquee 를
 * 좌측 신뢰 파트너 슬롯에 서버 렌더 결과로 주입한다.
 */
export default function ContactPage() {
  return <ContactForm logosSlot={<LogoMarquee />} />;
}
