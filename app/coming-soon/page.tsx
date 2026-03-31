import Link from "next/link";
import { ArrowLeft, Clock3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComingSoonPageProps {
  searchParams?: Promise<{
    feature?: string;
  }>;
}

const featureLabels: Record<string, string> = {
  docs: "Documentation",
  settings: "Settings",
  playgrounds: "Playgrounds Directory",
  api: "API",
};

export default async function ComingSoonPage({
  searchParams,
}: ComingSoonPageProps) {
  const resolvedSearchParams = await searchParams;
  const featureKey = resolvedSearchParams?.feature ?? "feature";
  const featureName = featureLabels[featureKey] ?? "This section";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(233,63,63,0.18),_transparent_32%),linear-gradient(180deg,_#090909,_#151515)] px-6 py-12">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-black/45 p-8 text-center shadow-[0_35px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-12">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e93f3f]/15 text-[#ff8f8f]">
          <Clock3 className="h-8 w-8" />
        </div>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e93f3f]/25 bg-[#e93f3f]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#ff9c9c]">
          <Sparkles className="h-3.5 w-3.5" />
          Coming Soon
        </div>

        <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
          {featureName} is on the way
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-300 md:text-base">
          This route has been reserved so the app doesn&apos;t send you to an empty
          page. The full experience for {featureName.toLowerCase()} will be added
          soon.
        </p>

        <div className="mt-8 flex justify-center">
          <Button asChild className="bg-[#e93f3f] text-white hover:bg-[#d73737]">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
