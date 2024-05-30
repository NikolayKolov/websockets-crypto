"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import NextLinkLegacy from "@/components/common/Links/NextLinkLegacy";
import Image from "next/image";
import Form from 'react-bootstrap/Form';
import { search } from "@/lib/actions";
import debounce from "@/lib/utils/debounce";
import useOnClickOutside from "@/hooks/useOnClickOutside";

import styles from './search.module.scss';

type DataObject = {
    coins: {
        status: string,
        data: Array<any>
    },
    exchanges: {
        status: string,
        data: Array<any>
    }
}

type FormData = {
    status: string,
    data: DataObject
}

const FormContent = ({ data } : { data?: FormData }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [openResults, setOpenResults] = useState(false);
    const { pending } = useFormStatus();
    const iconHeight = 20;
    const searchIconSrc = "/icons/common/search.svg";
    const dataStatus = data?.status ?? 'idle';
    
    useEffect(() => {
        if (pending === false && dataStatus === 'done') inputRef.current?.focus();
    }, [pending, dataStatus]);

    const handleInputFocus = () => {
        if (openResults === false) setOpenResults(true);
    }

    useOnClickOutside(containerRef, () => {
        if (openResults) setOpenResults(false);
    });

    let resultsClassName = `bg-secondary-subtle ${styles['search-results']}`;
    if (openResults) resultsClassName += ` ${styles['search-results__opened']} `;
    if (openResults && dataStatus === 'done' && (data?.data.coins.data.length || data?.data.exchanges.data.length))
        resultsClassName += 'border border-2 rounded border-dark-subtle';

    return (
        <div ref={containerRef}>
            {
                pending ? 
                    <div className={`${styles.searchImg} spinner-border spinner-border-sm position-absolute pe-none`} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div> :
                    <Image
                        src={searchIconSrc}
                        alt="search"
                        className="position-absolute pe-none"
                        width={iconHeight}
                        height={iconHeight}/>
            }
            <Form.Control
                type="text"
                name="search"
                placeholder="Search here..."
                size="sm"
                disabled={pending}
                ref={inputRef}
                className={`${openResults ? styles.searchFocus : ''}`}
                onFocus={handleInputFocus} />
            <div
                className={resultsClassName}>
                {
                    data !== undefined && data.data.coins.data.length > 0 ?
                        <div className="list-group list-group-flush">
                            <p className="p-2 fs-5 text-decoration-underline mb-0">Coins</p>
                            {
                                data.data.coins.data.slice(0, 5).map(el => (
                                    <NextLinkLegacy key={el.id} href={`/coin/${el.id}`}>
                                        <a
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenResults(false);
                                            }}
                                            className="list-group-item list-group-item-action px-2 py-1">
                                            {el.name + " ("+ el.symbol + ')'}
                                        </a>
                                    </NextLinkLegacy>
                                ))
                            }
                        </div> : 
                        null
                }
                {
                    data !== undefined && data.data.exchanges.data.length > 0 ?
                        <div>
                            <p className="p-2 fs-5 text-decoration-underline mb-0">Exchanges</p>
                            <div className="list-group list-group-flush">
                                {
                                    data.data.exchanges.data.slice(0, 5).map(el => (
                                        <NextLinkLegacy key={el.exchangeId} href={`/exchange/${el.exchangeId}`}>
                                            <a
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenResults(false);
                                                }}
                                                className="list-group-item list-group-item-action px-2 py-1">
                                                {el.name}
                                            </a>
                                        </NextLinkLegacy>))
                                }
                            </div>
                        </div> : 
                        null
                }
            </div>
        </div>
    )
}

const initialState = {
    status: 'idle',
    data: {
        coins: {
            status: 'idle',
            data: []
        },
        exchanges: {
            status: 'idle',
            data: []
        }
    }
};

export default function Search() { 
    const formRef = useRef<HTMLFormElement | null>(null);   
    const [state, formAction] = useFormState(search, { ...initialState });
    const [searchString, setSearchString] = useState('');

    const handleOnChange = debounce((e: React.SyntheticEvent<HTMLElement>) => {
        if (formRef.current !== null) {
            formRef.current.requestSubmit();
            setSearchString((e.target as HTMLInputElement).value.trim());
        }
    });

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        const searchTerm = (e.target as HTMLFormElement).search.value.trim();
        if (searchTerm.length < 3) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    return (
        <div className={`${styles.searchBar} position-relative me-3`}>
            <form action={formAction} onSubmit={handleSubmit} onChange={handleOnChange} ref={formRef}>
                <FormContent data={searchString.length > 2 ? state : initialState} />
            </form>
        </div>
    )
}