"use client";

import { useEffect } from "react";
import { getSystemDarkMode, getUserDarkMode, setBootstrapDarkMode } from "@/components/containers/Header/utils/theme";

export default function BootstrapDarkModeInit() {
    // initialize Bootstrap dark mode from localStorage
    useEffect(() => {
        const userDarkMode = getUserDarkMode();
        if (userDarkMode !== null) {
            setBootstrapDarkMode(userDarkMode);
            localStorage.setItem('darkMode', userDarkMode ? 'on' : 'off');
            return;
        }
        
        const systemDarkMode = getSystemDarkMode();
        if (systemDarkMode !== null) {
            setBootstrapDarkMode(systemDarkMode);
            localStorage.setItem('darkMode', systemDarkMode ? 'on' : 'off');
            return;
        }

        setBootstrapDarkMode(false);
        localStorage.setItem('darkMode', 'off');
    }, []);

    return null;
}