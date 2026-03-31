import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Atom,
  Binary,
  Blocks,
  Braces,
  Code2,
  Cpu,
  Database,
  FileCode2,
  Globe,
  Hexagon,
  Layers3,
  Network,
  Rocket,
  Server,
  ShieldCheck,
  TerminalSquare,
  Workflow,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const floatingLanguages = [
  {
    label: "TypeScript",
    icon: FileCode2,
    className:
      "left-[4%] top-[8%] floating-badge-delayed hidden md:flex",
  },
  {
    label: "React",
    icon: Layers3,
    className:
      "right-[5%] top-[10%] floating-badge-slow hidden lg:flex",
  },
  {
    label: "Node.js",
    icon: Database,
    className:
      "left-[6%] bottom-[18%] floating-badge-fast hidden md:flex",
  },
  {
    label: "Next.js",
    icon: Globe,
    className:
      "right-[6%] bottom-[16%] floating-badge-delayed hidden md:flex",
  },
  {
    label: "JSON",
    icon: Braces,
    className:
      "left-[28%] top-[4%] floating-badge-slow hidden xl:flex",
  },
  {
    label: "JavaScript",
    icon: Code2,
    className:
      "left-[7%] top-[28%] floating-badge-fast hidden lg:flex",
  },
  {
    label: "Python",
    icon: Workflow,
    className:
      "right-[7%] top-[30%] floating-badge-delayed hidden lg:flex",
  },
  {
    label: "Express",
    icon: Server,
    className:
      "right-[4%] top-[50%] floating-badge-fast hidden xl:flex",
  },
  {
    label: "MongoDB",
    icon: Database,
    className:
      "left-[28%] bottom-[12%] floating-badge-delayed hidden lg:flex",
  },
  {
    label: "Prisma",
    icon: Hexagon,
    className:
      "right-[18%] top-[10%] floating-badge-slow hidden lg:flex",
  },
  {
    label: "Tailwind",
    icon: Layers3,
    className:
      "left-[16%] top-[14%] floating-badge-fast hidden xl:flex",
  },
  {
    label: "HTML5",
    icon: Blocks,
    className:
      "right-[20%] top-[20%] floating-badge-delayed hidden xl:flex",
  },
  {
    label: "CSS3",
    icon: Globe,
    className:
      "left-[5%] bottom-[36%] floating-badge-slow hidden xl:flex",
  },
  {
    label: "REST API",
    icon: Network,
    className:
      "left-[15%] bottom-[40%] floating-badge-fast hidden xl:flex",
  },
  {
    label: "Webhooks",
    icon: Rocket,
    className:
      "left-[16%] bottom-[16%] floating-badge-delayed hidden xl:flex",
  },
  {
    label: "Auth",
    icon: ShieldCheck,
    className:
      "right-[16%] bottom-[18%] floating-badge-slow hidden xl:flex",
  },
  {
    label: "CLI",
    icon: TerminalSquare,
    className:
      "right-[7%] top-[68%] floating-badge-delayed hidden lg:flex",
  },
  {
    label: "GraphQL",
    icon: Binary,
    className:
      "right-[29%] top-[5%] floating-badge-fast hidden xl:flex",
  },
  {
    label: "React Native",
    icon: Atom,
    className:
      "left-[7%] bottom-[50%] floating-badge-delayed hidden xl:flex",
  },
  {
    label: "DevOps",
    icon: Cpu,
    className:
      "right-[29%] bottom-[14%] floating-badge-slow hidden xl:flex",
  },
];

export default async function Home() {
  const session = await auth();
  const ctaHref = session?.user ? "/dashboard" : "/auth/sign-in";
  const ctaLabel = session?.user ? "Open Dashboard" : "Sign In to Start";

  return (
    <div className="relative z-20 flex min-h-screen flex-col items-center justify-start overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(233,63,63,0.12),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.08),_transparent_26%)]" />

      {floatingLanguages.map(({ label, icon: Icon, className }) => (
        <div
          key={label}
          className={`floating-badge absolute items-center gap-3 rounded-2xl border border-[#e93f3f]/12 bg-white/45 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-md dark:bg-white/6 dark:text-zinc-200 ${className}`}
        >
          <Icon className="h-4 w-4 text-[#e93f3f]" />
          <span>{label}</span>
        </div>
      ))}

      <div className="relative my-5 flex flex-col items-center justify-center">
        <div className="absolute inset-x-8 top-15 h-56 rounded-full bg-[#e93f3f]/12 blur-3xl" />
        <Image
          src={"/hero.svg"}
          alt="Hero-Section"
          height={600}
          width={600}
          className="relative z-10"
        />

        <h1 className="z-20 mt-5 max-w-5xl text-center text-5xl font-extrabold leading-[1.15] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 dark:from-rose-400 dark:via-red-400 dark:to-pink-400 md:text-6xl">
          Vibe Code With Intelligence
        </h1>
      </div>

      <p className="mt-2 max-w-3xl px-5 py-10 text-center text-lg text-gray-600 dark:text-gray-400">
        VibeCode Editor is a powerful and intelligent code editor that enhances
        your coding experience with advanced features and seamless integration.
        It is designed to help you write, debug, and optimize your code
        efficiently.
      </p>
      <Link href={ctaHref}>
        <Button variant={"brand"} className="mb-4" size={"lg"}>
          {ctaLabel}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Button>
      </Link>
    </div>
  );
}
