"use client";

import React from 'react'
import { LogoutButtonProps } from '../types'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react';

const LogoutButton = ({children}:LogoutButtonProps) => {
    const router = useRouter();
    const onLogout = async()=>{
        const result = await signOut({
            redirect: false,
            callbackUrl: "/auth/sign-in",
        });
        router.replace(result?.url || "/auth/sign-in");
        router.refresh();
    }
  return (
    <span className='cursor-pointer' onClick={onLogout}>
        {children}
    </span>
  )
}

export default LogoutButton
