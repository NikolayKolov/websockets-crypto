"use client";

import Navbar from "react-bootstrap/Navbar";
import { forwardRef, ForwardedRef, AnchorHTMLAttributes, ReactNode } from "react";

export type ClientLinkProps = {
    children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const BrandLink = forwardRef((props: ClientLinkProps, ref: ForwardedRef<HTMLAnchorElement>) => {
    const {href, onClick, children, ...rest} = props;

    return (
        <Navbar.Brand
            ref={ref}
            href={href}
            onClick={onClick}
            {...rest}>
            {children}
        </Navbar.Brand>
    )
});

BrandLink.displayName = "BrandLink";

export default BrandLink;