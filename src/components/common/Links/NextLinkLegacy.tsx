import Link from "next/link";
import { ComponentProps, ReactNode } from "react";

type NextLinkLegacy = ComponentProps<typeof Link> & {children: ReactNode}

export default function NextLinkLegacy(props: NextLinkLegacy) {
    const { href, children, ...rest } = props;
    return (
        <Link href={href} {...rest} passHref legacyBehavior>
            {children}
        </Link>
    )
}