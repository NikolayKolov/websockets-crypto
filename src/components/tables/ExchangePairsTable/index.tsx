"use client";

import { useMemo } from 'react';
import PaginatedDataTable from '../BaseTable/PaginatedDataTable'
import { ColumnDef, Row } from '@tanstack/react-table';
import { ExchangePairType } from '@/lib/types/tableTypes';
import { formatCurrencyDynamicFractions, formatNumber, formatPercentage } from '../utils/numberFormatter';
import CoinLink from './components/CoinLink';
import renderClientSideUpdated from '../components/renderClientSideUpdated';

export default function ExchangePairsTable({ data } : { data: Array<ExchangePairType> }) {
    const columns: ColumnDef<ExchangePairType, any>[] = useMemo<ColumnDef<ExchangePairType, any>[]>(() => [
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
            accessorFn: (row: ExchangePairType) => {
                return {
                    baseSymbol: row.baseSymbol,
                    baseId: row.baseId,
                    quoteSymbol: row.quoteSymbol,
                    quoteId: row.quoteId
                }
            },
            sortingFn: (rowA: Row<ExchangePairType>, rowB: Row<ExchangePairType>, _columnId: string): number => {
                return rowA.original.baseSymbol.localeCompare(rowB.original.baseSymbol);
            },
            id: 'pair',
            cell: info => (
                <span>
                    <CoinLink coinId={info.getValue().baseId} coinLabel={info.getValue().baseSymbol} />/
                    <CoinLink coinId={info.getValue().quoteId} coinLabel={info.getValue().quoteSymbol} />
                </span>
            ),
            header: () => <span>Pair</span>,
        },
        {
            accessorKey: 'priceQuote',
            id: 'priceQuote',
            cell: info => <p className='text-end'>{info.getValue()}</p>,
            header: () => <p className='text-end'>Rate</p>,
            meta: {
                textEnd: true
            },
        },
        {
            accessorKey: 'priceUsd',
            id: 'priceUsd',
            cell: info => <p className='text-end'>{formatCurrencyDynamicFractions(info.getValue())}</p>,
            header: () => <p className='text-end'>Price</p>,
            meta: {
                textEnd: true
            },
        },
        {
            accessorKey: 'volumeUsd24Hr',
            id: 'volumeUsd24Hr',
            cell: info => <p className='text-end'>{formatCurrencyDynamicFractions(info.getValue(), { notation: 'compact' })}</p>,
            header: () => <p className='text-end'>Volume (24Hr)</p>,
            meta: {
                textEnd: true
            },
        },
        {
            accessorKey: 'percentExchangeVolume',
            id: 'percentExchangeVolume',
            cell: info => <p className='text-end'>{formatPercentage(info.getValue() / 100)}</p>,
            header: () => <p className='text-end'>Volume (%)</p>,
            meta: {
                textEnd: true
            },
        },
        {
            accessorKey: 'tradesCount24Hr',
            id: 'tradesCount24Hr',
            cell: info => <p className='text-end'>{formatNumber(info.getValue())}</p>,
            header: () => <p className='text-end'>Trades (24Hr)</p>,
            meta: {
                textEnd: true
            },
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
        <PaginatedDataTable data={data} columns={columns} />
    )
}