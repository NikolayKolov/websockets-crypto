"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import PaginatedDataTable from './BaseTable/PaginatedDataTable';
import { JSONExchangeType } from '@/lib/types/genericAPIResponse';
import { formatCurrencyDynamicFractions, formatPercentage } from './utils/numberFormatter';
import useSWR from 'swr';

import { ColumnDef } from '@tanstack/react-table';
import { fetchExchanges } from '@/lib/fetch';
import renderClientSideUpdated from './components/renderClientSideUpdated';

export type ExchangeType = {
    exchangeId: string,
    name: string,
    rank: number,
    percentTotalVolume: number | null,
    volumeUsd: number | null,
    tradingPairs: number | null,
    socket: boolean | null,
    exchangeUrl: string | null,
    updated: number
}

const fetcher = async () => {
    const resp = await fetchExchanges();
    if (resp.status === 'success') return resp.data;
    else throw new Error(resp.error.message);
}

const refreshInterval = 60 * 1000;

function processJSONData(data: Array<JSONExchangeType>): Array<ExchangeType> {
    return data.map((exchange: JSONExchangeType) => {

        let percentTotalVolume = Number(exchange.percentTotalVolume);
        if (Number.isNaN(percentTotalVolume)) percentTotalVolume = 0;

        let volumeUsd = Number(exchange.volumeUsd);
        if (Number.isNaN(volumeUsd)) volumeUsd = 0;

        let tradingPairs = Number(exchange.tradingPairs);
        if (Number.isNaN(tradingPairs)) tradingPairs = 0;

        let socket = Boolean(exchange.socket);

        return {
            ...exchange,
            rank: Number(exchange.rank),
            percentTotalVolume,
            volumeUsd,
            tradingPairs,
            socket
        }
    });
}

function getSoonestUpdatedExchange(initialArray: Array<ExchangeType>) {
    const sortedArray = [...initialArray].sort((a, b) => Number(b.updated) - Number(a.updated));
    const soonestLastUpdatedAt = sortedArray[0].updated;
    return soonestLastUpdatedAt;
}

export default function ExchangesDataTable({data}: {data: Array<JSONExchangeType>}) {

    const [tableData, setTableData] = useState<Array<ExchangeType>>(processJSONData(data));
    const revalidateOnMount = getSoonestUpdatedExchange(tableData) + refreshInterval - Date.now() < 0;

    // refresh the table data every minute
    useSWR('/exchanges', fetcher, {
        refreshInterval: refreshInterval,
        revalidateOnMount: revalidateOnMount,
        revalidateOnFocus: true,
        refreshWhenHidden: true,
        focusThrottleInterval: refreshInterval / 2,
        onSuccess: (dataI, _key, _config) => {
            const processedData = processJSONData(dataI);
            setTableData(processedData);
        }
    });

    const columns: ColumnDef<ExchangeType, any>[] = useMemo<ColumnDef<ExchangeType, any>[]>(() => [
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
            accessorKey: 'exchangeId',
            id: 'id',
            cell: info => info.getValue(),
            header: () => 'Id'
        },
        {
            accessorKey: 'name',
            id: 'name',
            cell: info => (
                <Link href={`/exchange/${info.row.getValue('id')}`} className='text-reset text-decoration-none'>
                    {info.getValue()}
                </Link>
            ),
            header: () => <span>Name</span>,
        },
        {
            accessorKey: 'tradingPairs',
            id: 'tradingPairs',
            cell: info => (<p className='text-end'>{info.getValue()}</p>),
            header: () => <p className='text-end'>Trading Pairs</p>,
            meta: {
                textEnd: true
            }
        },
        {
            accessorKey: 'volumeUsd',
            id: 'volumeUsd',
            cell: info => {
                return (<p className='text-end'>{formatCurrencyDynamicFractions(info.getValue(), { notation: 'compact' })}</p>);
            },
            header: () => <p className='text-end'>Volume (24Hr)</p>,
            meta: {
                textEnd: true
            }
        },
        {
            accessorKey: 'percentTotalVolume',
            id: 'percentTotalVolume',
            cell: info => {
                return (<p className='text-end'>{formatPercentage(info.getValue())}</p>);
            },
            header: () => <p className='text-end'>Total (%)</p>,
            meta: {
                textEnd: true,
                // column should be hidden when screen width
                // is below certain pixel width
                hideBelow: 576
            }
        },
        {
            accessorKey: 'updated',
            id: 'updated',
            cell: renderClientSideUpdated,
            header: () => <p className='text-end'>Last updated</p>,
            // column should be hidden when screen width
            // is below certain pixel width
            meta: {
                textEnd: true,
                hideBelow: 576
            }
        }
    ], []);

    return (
        <PaginatedDataTable data={tableData} columns={columns} />
    )
}