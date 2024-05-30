import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { JSONExchangeType } from '@/lib/types/genericAPIResponse';
import { ExchangeType } from '@/lib/types/tableTypes';
import { fetchExchangeDetail } from "@/lib/fetch";

function processJSONData(data: JSONExchangeType): ExchangeType {
    let rank = Number(data.rank);
    if (Number.isNaN(rank)) rank = 0;

    let percentTotalVolume = Number(data.percentTotalVolume);
    if (Number.isNaN(percentTotalVolume)) percentTotalVolume = 0;

    let volumeUsd = Number(data.volumeUsd);
    if (Number.isNaN(volumeUsd)) volumeUsd = 0;

    let tradingPairs = Number(data.tradingPairs);
    if (Number.isNaN(tradingPairs)) tradingPairs = 0;

    return {
        ...data,
        rank,
        percentTotalVolume,
        volumeUsd,
        tradingPairs
    };
}

type ExchangeHookProps = {
    exchangeId: string
}

const refreshInterval = 60 * 1000;

export default function useExchangeData({ exchangeId }: ExchangeHookProps) {
    const { cache } = useSWRConfig();
    const initFromCache = () => {
        const cachedDetails = cache.get(`/exchanges/${exchangeId}`)?.data;
        if (cachedDetails === undefined) return null;

        const firstPairLastUpdatedAt = cachedDetails.updated;
        if (firstPairLastUpdatedAt !== undefined && firstPairLastUpdatedAt + refreshInterval - Date.now() > 0) {
            return processJSONData(cache.get(`/exchanges/${exchangeId}`)?.data);
        } else {
            return null;
        }
    }

    const [exchangeDetails, setExchangeDetails] = useState<null | ExchangeType>(initFromCache);
    const revalidateSWRonMount = exchangeDetails === null;

    const fetcher = async () => {
        const resp = await fetchExchangeDetail(exchangeId);
        if (resp.status === 'error') throw new Error(resp.error.message);
        else return resp.data;
    }

    const { isLoading, isValidating, error } = useSWR(`/exchanges/${exchangeId}`, fetcher, {
        refreshInterval: refreshInterval,
        revalidateOnMount: revalidateSWRonMount,
        revalidateOnFocus: true,
        focusThrottleInterval: refreshInterval / 2,
        onSuccess: (dataArray) => {
            setExchangeDetails(processJSONData(dataArray));
        },
        onError: (error, key) => {
            console.log('useSWR error', error);
            console.log('useSWR error key', key);
        }
    });

    return { isLoading, isValidating, error, exchangeDetails };
}