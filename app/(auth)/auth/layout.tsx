import React from "react";



const AuthLayout = ({children}:{children:React.ReactNode})=>{
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(233,63,63,0.22),_transparent_38%),linear-gradient(135deg,_#080808,_#131313_55%,_#1b1010)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
           <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#e93f3f]/10 blur-3xl" />
           <div className="relative z-10 w-full max-w-5xl">
             {children}
           </div>
        </main>
    )
}

export default AuthLayout
