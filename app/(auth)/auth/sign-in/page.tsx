import SignInFormClient from "@/modules/auth/components/sign-in-form-client";
import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_0.8fr] xl:gap-10">
      <div className="space-y-6 lg:space-y-7">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#ff8f8f]">
            VibeCode Editor
          </p>
          <h1 className="max-w-xl text-4xl font-black leading-[1.05] text-white md:text-5xl xl:text-[3.4rem]">
            Code faster, import smarter, ship from one cinematic workspace.
          </h1>
          <p className="max-w-lg text-sm leading-7 text-zinc-300 md:text-base">
            Sign in to open your playgrounds, pull folders from GitHub, and keep
            your editor experience consistent across the entire project.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur md:p-7 lg:mx-0">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#e93f3f]/20 blur-3xl md:h-36 md:w-36" />
          <Image
            src="/login.svg"
            alt="Login Illustration"
            height={360}
            width={360}
            className="relative z-10 mx-auto h-auto w-full max-w-[280px] md:max-w-[320px] lg:max-w-[340px]"
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
