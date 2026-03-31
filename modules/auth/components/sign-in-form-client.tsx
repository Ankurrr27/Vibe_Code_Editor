import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Chrome, Github, ShieldCheck, Sparkles, ArrowUpRight } from "lucide-react";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

async function handleGoogleSignIn() {
  "use server";
  await signIn("google", { redirectTo: DEFAULT_LOGIN_REDIRECT });
}

async function handleGithubSignIn() {
  "use server";
  await signIn("github", { redirectTo: DEFAULT_LOGIN_REDIRECT });
}

const SignInFormClient = () => {
  return (
    <Card className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-black/55 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <CardContent className="grid gap-8 p-8 md:p-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e93f3f]/30 bg-[#e93f3f]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#ff9d9d]">
            <Sparkles className="h-3.5 w-3.5" />
            VibeCode Access
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-black leading-tight text-white md:text-5xl">
              Sign in and start building with intelligence
            </h2>
            <p className="max-w-lg text-sm leading-6 text-zinc-300 md:text-base">
              Continue with Google or GitHub to jump back into your playgrounds,
              import repositories, and keep everything synced to your editor flow.
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          <form action={handleGoogleSignIn}>
            <Button
              type="submit"
              className="group h-14 w-full justify-between rounded-2xl border border-white/10 bg-white text-black hover:bg-white/90"
            >
              <span className="flex items-center gap-3 text-sm font-semibold">
                <Chrome className="h-5 w-5" />
                Continue with Google
              </span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>
          </form>

          <form action={handleGithubSignIn}>
            <Button
              type="submit"
              variant="outline"
              className="group h-14 w-full justify-between rounded-2xl border-white/15 bg-white/5 text-white hover:border-[#e93f3f]/60 hover:bg-[#e93f3f]/10"
            >
              <span className="flex items-center gap-3 text-sm font-semibold">
                <Github className="h-5 w-5" />
                Continue with GitHub
              </span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>
          </form>
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[#e93f3f]/15 p-2 text-[#ff8e8e]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-white">Protected workspace</p>
              <p className="text-xs text-zinc-400">
                Your session lands back at the app root after a successful login.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[#e93f3f]/15 p-2 text-[#ff8e8e]">
              <Github className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-white">GitHub-ready import</p>
              <p className="text-xs text-zinc-400">
                Connect GitHub to pull repository folders directly into the editor.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInFormClient;
