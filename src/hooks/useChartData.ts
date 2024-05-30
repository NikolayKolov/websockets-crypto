import { useState } from "react";
import useSWR from "swr";
import { ChartCoinType, DataCoinType } from '@/lib/types/tableTypes';
import { fetchAssetHistory } from "@/lib/fetch";

function processJSONData(data: Array<DataCoinType>): Array<ChartCoinType> {
    return data.map((point: DataCoinType) => {
        let priceUsd = Number(point.priceUsd);
        if (Number.isNaN(priceUsd)) priceUsd = 0;

        let circulatingSupply = Number(point.circulatingSupply);
        if (Number.isNaN(circulatingSupply)) circulatingSupply = 0;

        return {
            ...point,
            priceUsd,
            circulatingSupply
        }
    });
}

export const chartPeriods = {
    '1h': { label: "1 Hour", interval: 'm1', offset: 1000 * 60, range: 1000 * 60 * 60 },
    '1d': { label: "1 Day", interval: 'm5', offset: 1000 * 60 * 5, range: 1000 * 60 * 60 * 24 },
    '1w': { label: "1 Week", interval: 'm30', offset: 1000 * 60 * 30, range: 1000 * 60 * 60 * 24 * 7 },
    '1m': { label: "1 Month", interval: 'h2', offset: 1000 * 60 * 60 * 2, range: 1000 * 60 * 60 * 24 * 31 },
    '3m': { label: "3 Months", interval: 'h6', offset: 1000 * 60 * 60 * 6, range: 1000 * 60 * 60 * 24 * 92 },
    '6m': { label: "6 Months", interval: 'h12', offset: 1000 * 60 * 60 * 12, range: 1000 * 60 * 60 * 24 * 183 },
    '1y': { label: "1 Year", interval: 'd1', offset: 1000 * 60 * 60 * 24, range: 1000 * 60 * 60 * 24 * 366 },
    'all': { label: "All", interval: 'd1', offset: 1000 * 60 * 60 * 24, range: 1000 * 60 * 60 * 24 * 366 * 10 },
}

type ChartDataHook = {
    coinId: string,
    interval?: keyof typeof chartPeriods,
}


export default function useChartData({coinId, interval}: ChartDataHook) {
    const [chartData, setChartData] = useState<null | Array<ChartCoinType>>(null);
    const [chartPeriod, setChartPeriod] = useState<keyof typeof chartPeriods>(interval ?? '1d');
    const [now, setNow] = useState(0);
    // on component rerender don't change start and end time for request
    // just in accordance with selected period
    if (Date.now() - now > chartPeriods[chartPeriod].offset) {
        setNow(Date.now());
    };

    const endTime = now - now % (chartPeriods[chartPeriod].offset);
    const startTime = endTime - chartPeriods[chartPeriod].range;
    const key = `${coinId}/history?interval=${chartPeriods[chartPeriod].interval}&start=${startTime}&end=${endTime}`;

    const fetcher = async () => {
        const resp = await fetchAssetHistory(key, {
            next: {
                revalidate: chartPeriods[chartPeriod].offset / (2 * 1000) - 2
            }
        });
        if (resp.status === 'error') throw new Error(resp.error.message);
        else return resp.data;
    }

    const { isLoading, isValidating, error } = useSWR(`/${key}`, fetcher, {
        refreshInterval: chartPeriods[chartPeriod].offset / 2,
        revalidateOnFocus: true,
        focusThrottleInterval: chartPeriods[chartPeriod].offset / 2 - 5,
        onSuccess: (data) => {
            if (chartData === null) setChartData(processJSONData(data));
            else if (data.length) {
                const lastPrevElem = chartData[chartData.length - 1];
                const lastNewElem = data[data.length - 1];
                if (lastPrevElem.time !== lastNewElem.time) setChartData(processJSONData(data));
            }
        },
        onError: (err) => {
            console.log('useSWR error', err)
        }
    });

    return { isLoading, isValidating, error, chartData, chartPeriod, setChartPeriod };
}