"use client";

import useSWR from 'swr';

const refreshInterval = 60000;

export default function useCoinsData({initialData}: {initialData?: any}) {

    const fetcher = async () => {
        try {
            const resp = await fetch('/api/coins/', { cache: "no-store" });
            const respData = await resp.json();
            if (respData.status === 'error') throw new Error(respData.message);
            const returnData = {
                data: respData.data,
                updatedAt: respData.timestamp
            };
            return returnData;
        } catch {
            throw new Error('Unknown error');
        }
    }

    const { isLoading, error, data } = useSWR(
        '/coins',
        fetcher, {
            refreshInterval: refreshInterval,
            revalidateIfStale: true,
            revalidateOnMount: initialData === undefined,
            revalidateOnFocus: true,
            focusThrottleInterval: refreshInterval,
            fallbackData: initialData !== undefined ? {
                data: initialData.data,
                updatedAt: initialData.timestamp
            } : undefined
        }
    );

    return { isLoading, error, coinsData: data };
}
