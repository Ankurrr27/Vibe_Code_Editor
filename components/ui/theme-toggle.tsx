
"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";


export function ThemeToggle(){
    const {setTheme , theme} = useTheme();
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );

    if(!mounted){
        return null;
    }

    return (
        <div 
        className="cursor-pointer"
        onClick={()=>{
            setTheme(theme === "light" ? "dark" : "light");
        }}
        >
            {
                theme === "light" ? (<Moon className="h-5 w-5 text-black"/>) : (<Sun className="h-5 w-5 text-white" color="white"/>)
            }
        </div>
    )
}

