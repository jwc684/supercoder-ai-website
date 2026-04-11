import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { faqReorderSchema } from "@/lib/validations";

/**
 * PATCH /api/faqs/reorder — FAQ 일괄 순서 재배치.
 *
 * body: { items: [{ id, order }, …] }
 * 트랜잭션으로 모든 항목을 한 번에 업데이트.
 */
export async function PATCH(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = faqReorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "유효하지 않은 입력", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await prisma.$transaction(
      parsed.data.items.map((it) =>
        prisma.faq.update({
          where: { id: it.id },
          data: { order: it.order },
        }),
      ),
    );
    // 순서 변경은 공개된 FAQ 표시 순서에도 영향을 주므로 랜딩 캐시 무효화.
    revalidatePath("/");
    return NextResponse.json({ ok: true, count: parsed.data.items.length });
  } catch (err) {
    console.error("[api/faqs/reorder] PATCH failed:", err);
    return NextResponse.json({ error: "재배치 실패" }, { status: 500 });
  }
}
