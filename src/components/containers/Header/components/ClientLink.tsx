"use client";

import Nav from "react-bootstrap/Nav";
import { forwardRef, ForwardedRef, AnchorHTMLAttributes, ReactNode } from "react";
import withActiveLink from "@/components/common/WrappedLink";

export type ClientLinkProps = {
    isActive: boolean,
    children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const ClientLink = forwardRef((props: ClientLinkProps, ref: ForwardedRef<HTMLAnchorElement>) => {
    const {href, onClick, isActive, children, ...rest} = props;

    return (
        <Nav.Link
            ref={ref}
            href={href}
            className={`text-uppercase ${isActive && 'fw-bold'}`}
            onClick={onClick}
            {...rest}>
            {children}
        </Nav.Link>
    )
});

ClientLink.displayName = "ClientLink";

export default withActiveLink(ClientLink);