"use client";

import { useState } from "react";
import { getSystemDarkMode, getUserDarkMode, setBootstrapDarkMode } from "../utils/theme";

const useThemeHook = () => {
    const [isDark, setDark] = useState<boolean>(() => {
        const userDarkMode = getUserDarkMode();
        if (userDarkMode !== null) return userDarkMode;

        const systemDarkMode = getSystemDarkMode();
        if (systemDarkMode !== null) return systemDarkMode;

        return false;
    });

    const toggleMode = () => {
        setDark(!isDark);
        localStorage.setItem('darkMode', !isDark ? 'dark' : 'light');
        setBootstrapDarkMode(!isDark)
    }

    return {darkMode: isDark, toggleMode};
}

export default useThemeHook;