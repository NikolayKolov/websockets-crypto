"use client";

import { useEffect, useMemo, useRef } from 'react';
import PaginatedDataTable from '../BaseTable/PaginatedDataTable';
import { ColumnDef, Row } from '@tanstack/react-table';
import NextLinkLegacy from '@/components/common/Links/NextLinkLegacy';
import CoinsDataTableSubRow from './components/CoinsDataTableSubRow';
import { CoinType } from '@/lib/types/tableTypes';
import { formatCurrencyDynamicFractions, formatNumber, formatPercentage } from '../utils/numberFormatter';
import IconImageFallback from '@/components/common/IconImageFallback';

import styles from './coinsTable.module.scss';

// WebSocket ready state
const ReadyState = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
}

export default function CoinsDataTable({data}: {data: Array<CoinType>}) {

    const columns: ColumnDef<CoinType, any>[] = useMemo<ColumnDef<CoinType, any>[]>(() => [
        {
            accessorKey: 'rank',
            id: 'rank',
            cell: info => <p>{info.getValue()}</p>,
            header: () => <span>Rank</span>,
            sortDescFirst: false,
            minSize: 70,
            size: 70,
            maxSize: 70,
        },
        {
            accessorKey: 'id',
            id: 'id',
            cell: info => info.getValue(),
            header: () => 'Id',
        },
        {
            accessorFn: (row: CoinType) => {
                return {
                    name: row.name,
                    symbol: row.symbol,
                    id: row.id
                }
            },
            sortingFn: (rowA: Row<CoinType>, rowB: Row<CoinType>, _columnId: string): number => {
                return rowA.original.name.localeCompare(rowB.original.name);
            },
            id: 'name',
            cell: info => (
                <NextLinkLegacy href={`/coin/${info.getValue().id}`}>
                    <a href={`/coin/${info.getValue().id}`} className='text-reset text-decoration-none'>
                        <div className='d-flex align-items-center' onClick={(e) => {
                            e.stopPropagation();
                        }}>
                            <IconImageFallback 
                                src={`/icons/coins/${info.getValue().symbol.toLowerCase()}.svg`}
                                fallbackSrc='/icons/coins/btc++.svg'
                                alt={info.getValue().symbol}
                                height={32}
                                width={32}
                                className='me-2' />
                            <div>
                                <p className={styles['coin-title']}>{info.getValue().name}</p>
                                <p className={`${styles['coin-subtitle']} text-body text-opacity-75`}>{info.getValue().symbol}</p>
                            </div>
                        </div>
                    </a>
                </NextLinkLegacy>
            ),
            header: () => <span>Name</span>,
        },
        {
            accessorKey: 'priceUsd',
            id: 'priceUsd',
            cell: info => {
                const symbol = (info.row.getValue('name') as {name: string, symbol: string}).symbol;
                const coinId = info.row.getValue('id');
                return (
                    <>
                        <p className='text-end' id={`coin-price-${symbol}`} data-coin-id={coinId} data-price-value={info.getValue()}>
                            {formatCurrencyDynamicFractions(info.getValue())}
                        </p>
                    </>
                );
            },
            header: () => <p className='text-end'>Price</p>,
            meta: {
                textEnd: true
            },
            minSize: 120,
            size: 150
        },
        {
            accessorKey: 'marketCapUsd',
            id: 'marketCapUsd',
            cell: info => {
                return (<p className='text-end'>{formatCurrencyDynamicFractions(info.getValue(), { notation: 'compact' })}</p>);
            },
            header: () => <p className='text-end'>Market Cap</p>,
            meta: {
                textEnd: true,
                // column should be hidden when screen width
                // is below certain pixel width
                hideBelow: 576
            }
        },
        {
            accessorKey: 'vwap24Hr',
            id: 'vwap24Hr',
            cell: info => {
                return (<p className='text-end'>{formatCurrencyDynamicFractions(info.getValue(), { notation: 'compact' })}</p>);
            },
            header: () => <p className='text-end'>VWAP 24Hr</p>,
            meta: {
                textEnd: true,
                // column should be hidden when screen width
                // is below certain pixel width
                hideBelow: 768
            }
        },
        {
            accessorKey: 'supply',
            id: 'supply',
            cell: info => <p className='text-end'>{formatNumber(info.getValue())}</p>,
            header: () => <p className='text-end'>Supply</p>,
            meta: {
                textEnd: true,
                // column should be hidden when screen width
                // is below certain pixel width
                hideBelow: 576
            }
        },
        {
            accessorKey: 'volumeUsd24Hr',
            id: 'volumeUsd24Hr',
            cell: info => {
                return (
                    <p className='text-end'>
                        {formatCurrencyDynamicFractions(info.getValue(), { notation: 'compact' })}
                    </p>
                );
            },
            header: () => <p className='text-end'>Volume 24Hr</p>,
            meta: {
                textEnd: true,
                // column should be hidden when screen width
                // is below certain pixel width
                hideBelow: 768
            }
        },
        {
            accessorKey: 'changePercent24Hr',
            id: 'changePercent24Hr',
            cell: info => {
                let classTextColor = 'text-danger';
                if (info.getValue() > 0) classTextColor = 'text-success'
                
                return (
                    <p className={`text-end ${classTextColor}`}>
                        {formatPercentage(info.getValue())}
                    </p>
                )
            },
            header: () => <p className='text-end'>Change 24Hr</p>,
            meta: {
                textEnd: true
            }
        }
    ], []);

    const onOpen = (_event: Event) => {
        // if websocket was reconnecting, cancel it
        if (webSocketTimoutRef.current !== null) {
            clearInterval(webSocketTimoutRef.current);
            webSocketTimoutRef.current = null;
        }
    }

    const onMessage = (event: MessageEvent) => {
        const messageData = JSON.parse(event.data);
        // if on new data the row should flash
        const getFlashing = localStorage.getItem('flashing');

        Object.keys(messageData).forEach(coin => {
            const coinPriceEl = document.querySelector(`p[data-coin-id='${coin}']`);
            if (coinPriceEl !== null) {
                const prevPrice = (coinPriceEl as HTMLParagraphElement).dataset.priceValue;
                // get the paretn table row element to add flashing animation to
                const parentRow = coinPriceEl.closest('tr');

                if (getFlashing === 'true') {
                    if (parentRow?.classList.contains(styles['flash__green'])) {
                        parentRow?.classList.remove(styles['flash__green']);
                    }
                    if (parentRow?.classList.contains(styles['flash__red'])) {
                        parentRow?.classList.remove(styles['flash__red']);
                    }
    
                    if (Number(prevPrice) > Number(messageData[coin])) {
                        parentRow?.classList.add(styles['flash__red']);
                        setTimeout(() => {
                            parentRow?.classList.remove(styles['flash__red']);
                        }, 1000);
                    } else {
                        parentRow?.classList.add(styles['flash__green']);
                        setTimeout(() => {
                            parentRow?.classList.remove(styles['flash__green']);
                        }, 1000);
                    }
                }
                
                coinPriceEl.textContent = formatCurrencyDynamicFractions(messageData[coin]);
                (coinPriceEl as HTMLParagraphElement).dataset.priceValue = messageData[coin];
            }
        });
    }

    const onError = (_event: Event) => {
        
        if (webSocketRef.current?.readyState !== ReadyState.OPEN) {
            reconnectSocket();
        }
    }

    const onClose = (event: CloseEvent) => {
        
        if (event.wasClean) return;
        reconnectSocket();
    }

    const webSocketRef = useRef<WebSocket | null>(null);
    const webSocketTimoutRef = useRef<NodeJS.Timeout | null>(null);
    const webSocketUrlRef = useRef<string>('');

    const webSocketCleanUp = () => {
        Object.keys(localStorage).filter(key => key.startsWith('coinLSPrice_')).forEach(key => localStorage.removeItem(key));
        if (webSocketRef.current !== null && webSocketRef.current.readyState !== ReadyState.CLOSED) {
            webSocketRef.current.removeEventListener('open', onOpen);
            webSocketRef.current.removeEventListener('message', onMessage);
            webSocketRef.current.removeEventListener('error', onError);
            webSocketRef.current.removeEventListener('close', onClose);
            webSocketRef.current.close();
            webSocketRef.current = null;
        }
    }

    const webSocketCreate = (url: string) => {
        webSocketRef.current = new WebSocket(url);
        webSocketRef.current.addEventListener('open', onOpen);
        webSocketRef.current.addEventListener('message', onMessage);
        webSocketRef.current.addEventListener('error', onError);
        webSocketRef.current.addEventListener('close', onClose);
    }

    const reconnectSocket = () => {
        webSocketCleanUp();
        webSocketTimoutRef.current = setInterval(() => {
            webSocketCreate(webSocketUrlRef.current);
        }, 1000)
    }

    useEffect(() => {
        return () => {
            webSocketCleanUp();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePaginationChange = () => {
        const coinPricesPElems = document.querySelectorAll("p[id^='coin-price-']");
        const coinIDs: string[] = [];
        coinPricesPElems.forEach((el) => {
            const datasetCoinId = (el as HTMLParagraphElement).dataset.coinId;
            if (datasetCoinId !== undefined) coinIDs.push(datasetCoinId);
        });

        // on page change, reset the websocket to fetch data
        const urlSocket = (process.env.NEXT_PUBLIC_API_WEBSOCKET_COINS as string) + '?assets=' + coinIDs.join(',');
        webSocketUrlRef.current = urlSocket;
        webSocketCleanUp();
        webSocketCreate(urlSocket);
    }

    const renderSubComponent = ({ row }: { row: Row<CoinType> }) => {
        return <CoinsDataTableSubRow row={row.original} webSocketRef={webSocketRef.current} />
    }

    return (
        <PaginatedDataTable
            data={data}
            columns={columns}
            onPaginationChange={handlePaginationChange}
            getRowCanExpand={() => true}
            renderSubComponent={renderSubComponent} />
    )
}