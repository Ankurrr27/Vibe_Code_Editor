import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import SiteViewCounter from "./site-view-counter";

export function Footer() {
  const quickLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/coming-soon?feature=docs", label: "Docs" },
    { href: "/compiler", label: "Compiler" },
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
      href: "https://www.linkedin.com/in/ankurrr27/",
      label: "LinkedIn",
      icon: Linkedin,
    },
  ];

  return (
    <footer className="relative border-t border-black/10 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-zinc-950 dark:text-white">
              VibeCode Editor
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Browser-based coding workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {quickLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="text-sm text-zinc-600 transition hover:text-[#e93f3f] dark:text-zinc-400 dark:hover:text-[#ff8f8f]"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-zinc-500 transition hover:text-[#e93f3f] dark:text-zinc-400 dark:hover:text-[#ff8f8f]"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-5 text-sm text-zinc-500 dark:border-white/10 md:flex-row md:items-center md:justify-between dark:text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Ankur Singh.</p>
          <SiteViewCounter />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
