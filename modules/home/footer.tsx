import Link from "next/link";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";

export function Footer() {
  const quickLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/coming-soon?feature=docs", label: "Docs" },
    { href: "/coming-soon?feature=settings", label: "Settings" },
    { href: "/coming-soon?feature=api", label: "API" },
  ];

  const socialLinks = [
    {
      href: "https://github.com/Ankurrr27/my-app",
      label: "Project GitHub",
      icon: Github,
    },
    {
      href: "https://github.com/Ankurrr27",
      label: "GitHub Profile",
      icon: Github,
    },
    {
      href:
        process.env.NEXT_PUBLIC_LINKEDIN_URL ||
        "https://www.linkedin.com/in/ankur-singh/",
      label: "LinkedIn",
      icon: Linkedin,
    },
  ];

  return (
    <footer className="relative border-t border-black/10 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(233,63,63,0.08),_transparent_32%)] dark:bg-[radial-gradient(circle_at_top,_rgba(233,63,63,0.12),_transparent_32%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.8fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e93f3f]">
              VibeCode Editor
            </p>
            <h2 className="max-w-xl text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Clean tooling for focused building, faster experiments, and smarter code flow.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              VibeCode Editor is a polished playground-driven coding experience
              built to help developers move from idea to execution with less
              friction and more clarity.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              About
            </h3>
            <div className="space-y-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              <p className="font-medium text-zinc-900 dark:text-white">
                Ankur Singh
              </p>
              <p>
                Building modern developer experiences with a strong focus on
                speed, usability, and clean visual polish.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Links
            </h3>
            <div className="space-y-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between text-sm text-zinc-700 transition hover:text-[#e93f3f] dark:text-zinc-300 dark:hover:text-[#ff8f8f]"
                >
                  <span className="inline-flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-black/10 pt-6 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Ankur Singh. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition hover:text-[#e93f3f] dark:hover:text-[#ff8f8f]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
