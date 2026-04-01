import { NextRequest, NextResponse } from "next/server";

const judge0BaseUrl =
  process.env.JUDGE0_BASE_URL ?? "https://ce.judge0.com";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as {
      languageId?: number;
      sourceCode?: string;
      stdin?: string;
    };

    if (!payload.languageId || !payload.sourceCode?.trim()) {
      return NextResponse.json(
        { error: "Language and source code are required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${judge0BaseUrl}/submissions?base64_encoded=false&wait=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language_id: payload.languageId,
          source_code: payload.sourceCode,
          stdin: payload.stdin ?? "",
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        {
          error: "Failed to execute code",
          details: text,
        },
        { status: 502 },
      );
    }

    const result = (await response.json()) as {
      stdout?: string | null;
      stderr?: string | null;
      compile_output?: string | null;
      message?: string | null;
      status?: { id: number; description: string };
      time?: string | null;
      memory?: number | null;
    };

    return NextResponse.json({
      status: result.status?.description ?? "Completed",
      stdout: result.stdout ?? "",
      stderr: result.stderr ?? "",
      compileOutput: result.compile_output ?? "",
      message: result.message ?? "",
      time: result.time ?? "",
      memory: result.memory ?? 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Compiler execution failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
