import SignInFormClient from "@/modules/auth/components/sign-in-form-client";
import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#ff8f8f]">
            VibeCode Editor
          </p>
          <h1 className="max-w-2xl text-5xl font-black leading-[1.05] text-white md:text-6xl">
            Code faster, import smarter, ship from one cinematic workspace.
          </h1>
          <p className="max-w-xl text-base leading-7 text-zinc-300">
            Sign in to open your playgrounds, pull folders from GitHub, and keep
            your editor experience consistent across the entire project.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#e93f3f]/20 blur-3xl" />
          <Image
            src="/login.svg"
            alt="Login Illustration"
            height={420}
            width={420}
            className="relative z-10 mx-auto"
          />
        </div>
      </div>

      <div className="flex justify-center lg:justify-end">
        <SignInFormClient />
      </div>
    </div>
  );
};

export default Page;
