/* eslint-disable react/display-name */
"use client";

import { usePathname } from "next/navigation";
import React, { FunctionComponent, ForwardedRef } from "react";
import { ClientLinkProps } from "@/components/containers/Header/components/ClientLink";

type ReturnPropsType = Omit<ClientLinkProps, 'isActive'>;

type WrapperProps = ReturnPropsType & {
    ref: ForwardedRef<unknown>;
}

const withActiveLink = (LinkComponent: FunctionComponent<ClientLinkProps>): FunctionComponent<ReturnPropsType> => {
    const AddActive = (props: WrapperProps) => {
        const path = usePathname();
        const isActive = props.href === path;

        return <LinkComponent {...props} isActive={isActive} />
    }

    return React.forwardRef((props: ReturnPropsType, ref) => <AddActive {...props} ref={ref} />);
}

export default withActiveLink;