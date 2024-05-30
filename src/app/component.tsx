"use client";

import React from "react";
import useCoinsData from "@/hooks/useCoinsData";
import TableSkeleton from "@/components/common/LoadingSkeletons/TableSkeleton";
import NoDataToDisplay from '@/components/common/NoDataToDisplay';
import CoinsDataTable from "@/components/tables/CoinsDataTable/CoinsDataTable";

export const revalidate = 30;

export default function Coins({ initialData }: { initialData?: any }) {

    const { isLoading, coinsData } = useCoinsData({ initialData });

    if (isLoading && coinsData?.data === undefined) return <TableSkeleton />;

    if (coinsData?.data === undefined) return <NoDataToDisplay />;

    if (coinsData.data !== undefined && coinsData.data.length === 0) return <NoDataToDisplay />;

    return (<CoinsDataTable data={coinsData.data} />);
}
