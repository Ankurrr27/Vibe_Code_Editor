import { NextResponse } from "next/server";

const judge0BaseUrl =
  process.env.JUDGE0_BASE_URL ?? "https://ce.judge0.com";

export async function GET() {
  try {
    const response = await fetch(`${judge0BaseUrl}/languages`, {
      cache: "force-cache",
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to load supported languages" },
        { status: 502 },
      );
    }

    const languages = (await response.json()) as Array<{
      id: number;
      name: string;
    }>;

    return NextResponse.json({
      languages: languages
        .filter((language) => typeof language.id === "number")
        .sort((a, b) => a.name.localeCompare(b.name)),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Compiler service is unavailable",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
