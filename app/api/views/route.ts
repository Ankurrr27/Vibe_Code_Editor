import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const counter = await db.siteViewCounter.upsert({
    where: { id: "global" },
    create: { id: "global", views: 1 },
    update: { views: { increment: 1 } },
    select: { views: true },
  });

  return NextResponse.json(counter);
}
