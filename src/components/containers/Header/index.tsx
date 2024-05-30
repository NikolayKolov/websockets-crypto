"use client";

import React, { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Stack from "react-bootstrap/Stack";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import NextLinkLegacy from "@/components/common/Links/NextLinkLegacy";
import ClientLink from "./components/ClientLink";
import BrandLink from "./components/BrandLink";
import ModalSettings from "./components/ModalSettings";
import Search from "./components/Search";

import Image from "next/image";
import { usePathname } from 'next/navigation'

import useThemeHook from "./hooks/useThemeHook";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import styles from './header.module.scss';

function Header(): React.ReactNode {
    const [openSideMenu, setSideMenu] = useState<boolean>(false);
    const [openModal, setModal] = useState<boolean>(false);
    const darkModeToggleRef = useRef<null | HTMLInputElement>(null);
    const {darkMode, toggleMode} = useThemeHook();
    const darkModeChecked: boolean = typeof darkMode === 'boolean' ? darkMode : false;
    const pathname = usePathname();
    const { storedValue: isFlashing, setValue: setFlashing } = useLocalStorage('flashing', true);

    useEffect(() => {
        if (openSideMenu) handleCloseMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const handleThemeToggle = () => {
        toggleMode && toggleMode();
    }

    const handleFlashingToggle = () => {
        setFlashing(!isFlashing);
    }

    const handleCloseMenu = () => setSideMenu(false);
    const handleShowMenu = () => setSideMenu(true);

    const handleCloseModal = () => setModal(false);
    const handleShowModal = () => setModal(true);

    const gearIconSrc = "/icons/common/gear-fill.svg";
    const iconHeight = 20;

    return (
        <>
            <Navbar fixed="top" expand="md" className={`${styles.header} bg-secondary-subtle`} onToggle={handleShowMenu}>
                <Container className="d-flex justify-content-between d-md-none" fluid>
                    <Search />
                    <NextLinkLegacy href="/">
                        <BrandLink>
                            <Image
                                src="/icons/coins/btc++.svg"
                                alt="logo"
                                height={36}
                                width={36}
                                className="me-1" />
                            <span>Coin Plus</span>
                        </BrandLink>
                    </NextLinkLegacy>
                    <Navbar.Toggle className="ms-1" />
                </Container>
                <Container className="d-none d-md-flex justify-content-between px-0 mx-auto container-md">
                    <Stack direction="horizontal" gap={1}>
                        <Nav>
                            <NextLinkLegacy href="/" prefetch={true}>
                                <ClientLink>Coins</ClientLink>
                            </NextLinkLegacy>
                            <NextLinkLegacy href="/exchanges" prefetch={true}>
                                <ClientLink>Exchanges</ClientLink>
                            </NextLinkLegacy>
                        </Nav>
                    </Stack>
                    <NextLinkLegacy href="/">
                        <BrandLink>
                            <Image
                                src="/icons/coins/btc++.svg"
                                alt="logo"
                                height={36}
                                width={36}
                                className="me-1" />
                            <span>Coin Plus</span>
                        </BrandLink>
                    </NextLinkLegacy>
                    <Stack direction="horizontal" gap={1}>
                        <Search />
                        <Image
                            src={gearIconSrc}
                            alt="settings"
                            width={iconHeight}
                            height={iconHeight}
                            onClick={handleShowModal} />
                    </Stack>
                </Container>
            </Navbar>
            <Offcanvas
                show={openSideMenu}
                onHide={handleCloseMenu}
                id="navbar-offcanvas"
                aria-labelledby="navbarLabel-offcanvas"
                placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id="navbarLabel-offcanvas">
                        Options
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className={styles.offcanvas}>
                    <Stack direction="vertical" gap={1}>
                        <NextLinkLegacy href="/" prefetch={true}>
                            <ClientLink>Coins</ClientLink>
                        </NextLinkLegacy>
                        <NextLinkLegacy href="/exchanges" prefetch={true}>
                            <ClientLink>Exchanges</ClientLink>
                        </NextLinkLegacy>
                        <hr className="my-2"/>
                        <Form.Check
                            type="switch"
                            id="theme-switch"
                            className="d-flex justify-content-between flex-row-reverse ps-0"
                            label="Toggle Dark theme"
                            ref={darkModeToggleRef}
                            checked={darkModeChecked}
                            onChange={handleThemeToggle} />
                        <Form.Check
                            type="switch"
                            id="flashing-switch"
                            checked={isFlashing}
                            className="d-flex justify-content-between flex-row-reverse ps-0"
                            label="Toggle flashing indicators"
                            onChange={handleFlashingToggle} />
                    </Stack>
                </Offcanvas.Body>
            </Offcanvas>
            <ModalSettings 
                show={openModal}
                onHide={handleCloseModal}
                darkModeChecked={darkModeChecked}
                flashingChecked={isFlashing}
                handleThemeToggle={handleThemeToggle}
                handleFlashingToggle={handleFlashingToggle}
                ref={darkModeToggleRef} />
        </>
    );
};

export default Header;