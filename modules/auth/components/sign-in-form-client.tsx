import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, ArrowUpRight } from "lucide-react";
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
    <Card className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-white/10 dark:bg-zinc-950">
      <CardContent className="grid gap-6 p-6 md:p-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Welcome to VibeCode
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Sign in or create your account.
          </p>
        </div>

        <div className="grid gap-3">
          <form action={handleGoogleSignIn}>
            <Button
              type="submit"
              className="group h-12 w-full justify-between rounded-xl border border-white/10 bg-white text-zinc-950 hover:bg-zinc-100 md:h-13"
            >
              <span className="flex items-center gap-3 text-sm font-semibold">
                <span aria-hidden="true" className="text-lg font-bold text-[#4285f4]">
                  G
                </span>
                Continue with Google
              </span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>
          </form>

          <form action={handleGithubSignIn}>
            <Button
              type="submit"
              variant="outline"
              className="group h-12 w-full justify-between rounded-xl border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10 md:h-13"
            >
              <span className="flex items-center gap-3 text-sm font-semibold">
                <Github className="h-5 w-5" />
                Continue with GitHub
              </span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          New accounts are created automatically.
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInFormClient;
