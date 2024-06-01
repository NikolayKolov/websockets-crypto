"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
    ColumnDef,
    PaginationState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    useReactTable,
} from '@tanstack/react-table';
import RBTable from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Image from 'next/image';

import styles from './paginatedTable.module.scss';
import useWindowSize from '@/hooks/useWindowSize';

type PaginatedDataTableProps<T> = {
    data: Array<T>,
    columns: ColumnDef<T, any>[],
    onPaginationChange?: (props?: any) => void,
    initialPaginationState?: { pIndex: number, pSize: number, sortedColumn: { id: string, desc: boolean} },
    getRowCanExpand?: () => boolean,
    renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement
}

export default function PaginatedDataTable<T extends object>(props: PaginatedDataTableProps<T>) {
    const { data, columns, onPaginationChange, initialPaginationState, getRowCanExpand, renderSubComponent } = props;

    const [tableData, setTableData] = useState(data);

    // update state on prop changes, causes partial render that is interrupted
    if (data !== tableData) {
        setTableData(data)
    }

    const [pagination, setPagination] = useState<PaginationState>(() => {
        if (initialPaginationState !== undefined) return {
            pageIndex: initialPaginationState?.pIndex ?? 0,
            pageSize: initialPaginationState?.pSize ?? 15
        };
        else return { pageIndex: 0, pageSize: 15 };
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columnsMemo: ColumnDef<T, any>[] = useMemo<ColumnDef<T, any>[]>(() => columns, []);

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        // all columns with ID should be hidden
        id: false,
    });

    const table = useReactTable({
        data: tableData,
        columns: columnsMemo,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        state: {
            columnVisibility,
            pagination,
        },
        initialState: {
            sorting: [
                {
                    id: initialPaginationState?.sortedColumn?.id ?? 'rank',
                    desc: initialPaginationState?.sortedColumn?.desc ?? false,
                },
            ]
        },
        autoResetPageIndex: false,
        enableSortingRemoval: false,
        debugTable: true,
    });

    const pIndex = table.getState().pagination.pageIndex;
    const pSize = table.getState().pagination.pageSize;
    const sortedColumn = table.getState().sorting[0];

    useEffect(() => {
        onPaginationChange && onPaginationChange({
            pIndex,
            pSize,
            sortedColumn
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pIndex, pSize, sortedColumn]);

    const { windowWidth } = useWindowSize();

    useEffect(() => {
        const newColumnsVisible: any = {};
        table.getAllColumns().forEach(col => {
            if (!col.getCanHide()) return;
            const colMeta = col.columnDef.meta as { hideBelow?: number };
            if (colMeta?.hideBelow === undefined) return;
            newColumnsVisible[col.id] = colMeta.hideBelow < windowWidth;
        });

        setColumnVisibility({
            ...columnVisibility,
            ...newColumnsVisible
        });
    }, [windowWidth]);

    return (
        <>
            <RBTable hover size="sm" className={styles.table}>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className='py-3 px-2' style={{
                                    width: header.column.columnDef.size,
                                    minWidth: header.column.columnDef.minSize,
                                    maxWidth: header.column.columnDef.maxSize,
                                }}>
                                    {header.isPlaceholder ?
                                        null :
                                        (
                                            <div
                                                className={
                                                    `${header.column.getCanSort() ?
                                                        'cursor-pointer select-none' :
                                                        ''} ${(header.column.columnDef.meta as any)?.textEnd === true ? 
                                                        'd-flex justify-content-end align-items-center' : ''}`
                                                }
                                                onClick={header.column.getToggleSortingHandler()}
                                                title={
                                                    header.column.getCanSort() ?
                                                        header.column.getNextSortingOrder() === 'asc' ?
                                                            'Sort ascending' :
                                                            header.column.getNextSortingOrder() === 'desc' ?
                                                                'Sort descending':
                                                                'Clear sort' :
                                                        undefined
                                                }
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {{
                                                    asc: <Image
                                                        src='/icons/common/caret-up-fill.svg'
                                                        alt="Up"
                                                        className={`${styles['sort-arrow']} ps-1`}
                                                        width={16}
                                                        height={16} />,
                                                    desc: <Image
                                                        src='/icons/common/caret-down-fill.svg'
                                                        alt="down"
                                                        className={`${styles['sort-arrow']} ps-1`}
                                                        width={16}
                                                        height={16} />,
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </div>
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <React.Fragment key={row.id}>
                            <tr onClick={() => row.getCanExpand() && row.toggleExpanded()}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className='p-2 align-middle' style={{
                                        width: cell.column.columnDef.size,
                                        minWidth: cell.column.columnDef.minSize,
                                        maxWidth: cell.column.columnDef.maxSize,
                                    }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                            {
                                row.getIsExpanded() && (
                                    <tr key={row.id + 'expanded'}>
                                        {/* 2nd row is a custom 1 cell row */}
                                        <td colSpan={row.getVisibleCells().length}>
                                            {renderSubComponent && renderSubComponent({ row })}
                                        </td>
                                    </tr>
                                )
                            }
                        </React.Fragment>
                    ))}
                </tbody>
            </RBTable>
            <Container fluid className='d-flex flex-wrap'>
                <div className='d-flex flex-wrap align-items-center mb-3 mb-lg-0 me-4'>
                    <Pagination className='mb-0 me-3'>
                        <Pagination.First
                            onClick={() => table.firstPage()}
                            disabled={!table.getCanPreviousPage()} />
                        <Pagination.Prev
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()} />
                        {
                            table.getState().pagination.pageIndex > 2 ?
                                <Pagination.Ellipsis /> :
                                null
                        }
                        {
                            table.getState().pagination.pageIndex > 1 &&
                            table.getState().pagination.pageIndex - 2 < table.getPageCount() ?
                                <Pagination.Item
                                    onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 2)}>
                                    {table.getState().pagination.pageIndex - 1}
                                </Pagination.Item> :
                                null
                        }
                        {
                            table.getState().pagination.pageIndex > 0 &&
                            table.getState().pagination.pageIndex - 1 < table.getPageCount() ?
                                <Pagination.Item
                                    onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 1)}>
                                    {table.getState().pagination.pageIndex}
                                </Pagination.Item> :
                                null
                        }
                        {
                            table.getState().pagination.pageIndex < table.getPageCount() ?
                                <Pagination.Item active>
                                    {table.getState().pagination.pageIndex + 1}
                                </Pagination.Item> :
                                null
                        }
                        {
                            table.getState().pagination.pageIndex + 1 < table.getPageCount() ?
                                <Pagination.Item
                                    onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)}>
                                    {table.getState().pagination.pageIndex + 2}
                                </Pagination.Item> :
                                null
                        }
                        {
                            table.getState().pagination.pageIndex + 2 < table.getPageCount() ?
                                <Pagination.Item
                                    onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 2)}>
                                    {table.getState().pagination.pageIndex + 3}
                                </Pagination.Item> :
                                null
                        }
                        {
                            table.getState().pagination.pageIndex + 3 < table.getPageCount() ?
                                <Pagination.Ellipsis /> :
                                null
                        }
                        <Pagination.Next
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()} />
                        <Pagination.Last
                            onClick={() => table.lastPage()}
                            disabled={!table.getCanNextPage()} />
                    </Pagination>
                    <span className="d-flex items-center gap-1 text-nowrap">
                                Page
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount().toLocaleString()}
                        </strong>
                    </span>
                </div>
                <div className='d-flex align-items-center me-4 mb-3 mb-lg-0'>
                    <span className='me-3 fw-semibold text-nowrap'>Go to page: </span>
                    <div className={styles['go-to-page--container']}>
                        <Form.Control
                            type="number"
                            value={table.getState().pagination.pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                table.setPageIndex(page)
                            }}
                            isInvalid={
                                table.getState().pagination.pageIndex + 1 > table.getPageCount()
                            } />
                        <Form.Control.Feedback type="invalid" tooltip>
                            Please input a number between 1 and {table.getPageCount().toLocaleString()}
                        </Form.Control.Feedback>
                    </div>
                </div>
                <div className={styles["page-number--container"]}>
                    <Form.Select
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}>
                        {
                            [10, 15, 20, 30, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                        Show {pageSize} rows per page
                                </option>
                            ))
                        }
                    </Form.Select>
                </div>
            </Container>
        </>
    )
}