"use client";

import Image from "next/image";
import { ComponentProps, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type ImageFallbackProps = {
    fallbackSrc: string;
} & ComponentProps<typeof Image>

const shimmer = (d: number = 32) => `
    <svg width="${d}" height="${d}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <circle r="${d/2}" fill="#333" cx="${d/2}" cy="${d/2}" />
        <animate attributeName="opacity" values="0.75;1;0.75" dur="1s" repeatCount="indefinite"  />
    </svg>`;

const toBase64 = (str: string) =>
    typeof window === "undefined"
        ? Buffer.from(str).toString("base64")
        : window.btoa(str);

export default function IconImageFallback(props: ImageFallbackProps) {
    const { src, fallbackSrc, alt, height, width,...rest } = props;
    const { storedValue: value, setValue, removeValue } = useLocalStorage(`missingSrc-${alt}`, false);
    const [imgSrc, setImgSrc] = useState<string>(value ? fallbackSrc : src.toString());

    return (
        <Image
            {...rest}
            src={imgSrc}
            alt={alt}
            height={height}
            width={width}
            onErrorCapture={() => {
                setImgSrc(fallbackSrc);
                setValue(true);
            }}
            onLoad={() => {
                !value && removeValue();
            }}
            placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(width && 32))}`} />
    )
}