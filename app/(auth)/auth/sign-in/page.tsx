import SignInFormClient from "@/modules/auth/components/sign-in-form-client";
import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-12">
      <div className="hidden items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-900/70 lg:flex">
        <Image
          src="/login.svg"
          alt="Code workspace illustration"
          height={380}
          width={420}
          className="h-auto w-full max-w-[360px]"
        />
      </div>

      <div className="flex justify-center">
        <SignInFormClient />
      </div>
    </div>
  );
};

export default Page;
