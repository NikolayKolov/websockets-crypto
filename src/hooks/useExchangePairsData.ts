import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { JSONExchangePairType, JSONResult } from '@/lib/types/genericAPIResponse';
import { ExchangePairType } from '@/lib/types/tableTypes';

function processJSONData(data: JSONExchangePairType[]): ExchangePairType[] {
    return data.map(pair => {
        let rank = Number(pair.rank);
        if (Number.isNaN(rank)) rank = 0;
    
        let priceQuote = Number(pair.priceQuote);
        if (Number.isNaN(priceQuote)) priceQuote = 0;
    
        let priceUsd = Number(pair.priceUsd);
        if (Number.isNaN(priceUsd)) priceUsd = 0;
    
        let volumeUsd24Hr = Number(pair.volumeUsd24Hr);
        if (Number.isNaN(volumeUsd24Hr)) volumeUsd24Hr = 0;
    
        let percentExchangeVolume = Number(pair.percentExchangeVolume);
        if (Number.isNaN(percentExchangeVolume)) percentExchangeVolume = 0;
    
        let tradesCount24Hr = Number(pair.tradesCount24Hr);
        if (Number.isNaN(tradesCount24Hr)) tradesCount24Hr = 0;
    
        return {
            ...pair,
            rank,
            priceQuote,
            priceUsd,
            volumeUsd24Hr,
            percentExchangeVolume,
            tradesCount24Hr
        };
    });
}

type ExchangePairsHookProps = {
    exchangeId: string
}

type FetcherFunction = () => Promise<JSONExchangePairType[]>;

const refreshInterval = 60 * 1000;

function getSoonestUpdatedPairsArray(cachedArray: Array<JSONExchangePairType>) {
    const sortedArray = [...cachedArray].sort((a, b) => Number(b.updated) - Number(a.updated));
    const soonestLastUpdatedAt = sortedArray[0].updated;
    return soonestLastUpdatedAt;
}

export default function useExchangePairsData({ exchangeId }: ExchangePairsHookProps) {
    const { cache } = useSWRConfig();

    const initFromCache = () => {
        const cachedArray = cache.get(`markets/${exchangeId}`)?.data;
        if (cachedArray === undefined) return null;

        const soonestLastUpdatedAt = getSoonestUpdatedPairsArray(cachedArray);
        if (soonestLastUpdatedAt !== undefined && soonestLastUpdatedAt + refreshInterval - Date.now() > 0) {
            return processJSONData(cachedArray);
        } else {
            return null
        }
    }

    const [exchangePairs, setExchangePairs] = useState<null | ExchangePairType[]>(initFromCache);
    const revalidateSWRonMount = exchangePairs === null;

    const fetcher: FetcherFunction = async () => {
        const resp = await fetch('/api/exchangePairs/' + exchangeId, { cache: "no-store" });
        const respResult: JSONResult<JSONExchangePairType[]> = await resp.json();
        if (respResult.status=== 'error') throw new Error(respResult.error.message)
        else return respResult.data;
    }

    const { isLoading, isValidating, error } = useSWR(`markets/${exchangeId}`, fetcher, {
        refreshInterval: refreshInterval,
        revalidateOnMount: revalidateSWRonMount,
        revalidateOnFocus: true,
        focusThrottleInterval: refreshInterval / 2,
        onSuccess: (dataArray) => {
            setExchangePairs(processJSONData(dataArray));
        },
        onError: (err) => {
            console.log('useSWR error', err)
        }
    });

    return { isLoading, isValidating, error, exchangePairs };
}