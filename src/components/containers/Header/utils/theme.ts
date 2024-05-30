"use client";

export function getSystemDarkMode(): boolean | null {
    if (typeof window !== "undefined") {
        if (!window.matchMedia) return null;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return null;
}

export function getUserDarkMode(): boolean | null {
    if (typeof window !== "undefined") {
        const userDarkMode = localStorage.getItem('darkMode');
        if (userDarkMode === null) return null;
        return userDarkMode === 'dark';
    }
    return null;
}

export function setBootstrapDarkMode(darkMode: boolean) {
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
}