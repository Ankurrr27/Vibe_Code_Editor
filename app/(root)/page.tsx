import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Layers3,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const features = [
  {
    title: "Browser IDE",
    description: "Write and run code without setup.",
    icon: Code2,
  },
  {
    title: "Project templates",
    description: "Start from a ready-to-use template.",
    icon: Layers3,
  },
  {
    title: "GitHub import",
    description: "Bring your repositories into the editor.",
    icon: Rocket,
  },
];

export default async function Home() {
  const session = await auth();
  const ctaHref = session?.user ? "/dashboard" : "/auth/sign-in";
  const ctaLabel = session?.user ? "Open your workspace" : "Get started for free";

  return (
    <div className="relative overflow-hidden">
      <section className="mx-auto grid min-h-[72svh] w-full max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-10 lg:py-12">
        <div className="relative z-10 mx-auto w-full max-w-2xl lg:mx-0">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
            <Code2 className="h-3.5 w-3.5 text-[#e93f3f]" />
            Browser-based code editor
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-zinc-950 dark:text-white sm:text-5xl xl:text-6xl">
            A workspace to{" "}
            <span className="text-[#e93f3f]">build and run</span> your code.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Create projects, use templates, and keep your code in one place.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={ctaHref}>
              <Button variant="brand" size="lg" className="h-11 w-full rounded-lg px-5 sm:w-auto">
                {ctaLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="#features"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5"
            >
              See features
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-zinc-900/70 sm:p-5">
          <Image
            src="/hero.svg"
            alt="VibeCode browser workspace"
            height={560}
            width={560}
            priority
            className="h-auto w-full"
          />
        </div>
      </section>

      <section
        id="features"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-12 sm:px-8 lg:pb-16"
      >
        <div className="mb-5">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-2xl">
            Built for your workflow
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900/70"
            >
              <div className="inline-flex rounded-lg bg-zinc-100 p-2 text-[#e93f3f] dark:bg-white/5">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
