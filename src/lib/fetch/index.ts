"use server";

import apiPaths from "./config";
import { apiConfigs } from "./config";
import {
    JSONCoinType,
    JSONExchangeType,
    JSONAssetHistoryType,
    JSONExchangePairType,
    JSONResult
} from "../types/genericAPIResponse";

const APIHost = process.env.API_HOST;
const APIKey = process.env.API_KEY;

async function fetchResolveError(response: Response) {
    if (response.headers.get('content-type')?.includes('application/json')) {
        const { error }: ResponseType & { error: string } = await response.json();
        return Promise.resolve({
            status: 'error',
            error: {
                message: error,
                status: response.status
            }
        });
    } else return Promise.resolve({
        status: 'error',
        error: {
            message: response.statusText,
            status: response.status
        }
    });
}

// default wrapper for all fetch queries to CoinCap API
async function fetchAPI<Object>(
    apiPath: URL,
    apiOptions: {
        useLimit?: boolean,
        offset?: number,
    } = { useLimit: false, offset: 0 },
    nextOptions?: object): Promise<JSONResult<Object>> {
    const { useLimit, offset } = apiOptions;
    const apiKeyHeaders = {
        headers: { authorization: `Bearer ${APIKey}` }
    };
    const defaultOptions = {
        ...apiKeyHeaders,
        next: { revalidate: apiConfigs.keepCacheSeconds }
    };

    let fetchOptions: object = defaultOptions;

    if (nextOptions !== undefined) {
        if (nextOptions.hasOwnProperty('headers')) {
            const opts = nextOptions as object & { headers: object & { authorization: string }};
            fetchOptions = {
                ...opts,
                headers: {
                    ...opts.headers,
                    ...apiKeyHeaders.headers
                }
            };
        } else {
            fetchOptions = {
                ...nextOptions,
                ...apiKeyHeaders
            };
        }
    }

    if (useLimit) {
        if (apiPath.searchParams.has('limit')) apiPath.searchParams.delete('limit')
        apiPath.searchParams.append('limit', apiConfigs.limitItemsPerRequest.toString());
        
        let continueFetch = true;
        let returnArray: any[] = [];
        let latestTimestamp = 0;
        let queryOffset = offset ?? 0;
        try {
            // use a do/while loop to avoid problems with how NextJS caches and calls
            // fetch requests in back end
            do {
                if (apiPath.searchParams.has('offset')) apiPath.searchParams.delete('offset');
                apiPath.searchParams.append('offset', queryOffset.toString());
    
                const response: Response = await fetch(apiPath, { ...fetchOptions });
    
                if (response.ok) {
                    const { data, timestamp }: ResponseType & { data: Object,timestamp: number } = await response.json();
                    if (Array.isArray(data)) {
                        returnArray = [...returnArray, ...data];
                        if (data?.length === apiConfigs.limitItemsPerRequest) {
                            queryOffset += apiConfigs.limitItemsPerRequest;
                        } else {
                            latestTimestamp = timestamp;
                            continueFetch = false;
                        }
                    } else {
                        return Promise.resolve({
                            status: 'error',
                            error: {
                                message: 'Unknown error',
                                status: 0
                            }
                        });
                    }
                } else {
                    continueFetch = false;
                    const respError = await fetchResolveError(response) as JSONResult<Object>;
                    return Promise.resolve({...respError});
                }
            } while (continueFetch);

            return Promise.resolve({
                status: 'success',
                data: returnArray as Object,
                timestamp: latestTimestamp
            });

        } catch {
            return Promise.resolve({
                status: 'error',
                error: {
                    message: 'Network error',
                    status: 0
                }
            });
        }
    }

    try {
        const response: Response = await fetch(apiPath, {
            ...fetchOptions
        });

        if (response.ok) {
            /* 13.04.2024 
               In NextJS v14.1.4, the dev build calls the fetch request twice. Works fine in prod.
               https://github.com/vercel/next.js/issues/58736
            */
            const { data, timestamp }: ResponseType & { data: Object,timestamp: number } = await response.json();

            return Promise.resolve({
                status: 'success',
                data,
                timestamp
            });
        } else {
            const respError = await fetchResolveError(response) as JSONResult<Object>;
            return Promise.resolve({...respError});
        }
    } catch (e) {
        return Promise.resolve({
            status: 'error',
            error: {
                message: 'A network error',
                status: 0
            }
        })
    }
}

// Use the same function to call the api, just change the paths
// Caching is handled in the api/coins endpoint
export const fetchCoins = (fetchAPI<Array<JSONCoinType>>).bind(
    null,
    new URL(apiPaths.coins, APIHost),
    { useLimit: true, offset: 0 },
    // cached in memory cache
    { next: { revalidate: 0 } }
);

// exchanges will be called client side every minute, cached serverside every 30 seconds (default)
export const fetchExchanges = (fetchAPI<Array<JSONExchangeType>>).bind(
    null,
    new URL(apiPaths.exchanges, APIHost),
);

// caching is handled with the options object, because depending on interval -
// 1 minute to 1 day, it can vary drastically and will be cached differently
export const fetchAssetHistory = (path: string, options?: object) => {
    const urlBase = new URL(apiPaths.coins, APIHost);
    const url = new URL(path, urlBase)
    return fetchAPI<Array<JSONAssetHistoryType>>(url, undefined, options);
}

// fetch details for each coin
export const fetchCoinDetail = (coinId: string) => {
    const url = new URL(coinId, new URL(apiPaths.coins, APIHost));
    return fetchAPI<JSONCoinType>(url);
}

// fetch details for each exchange
export const fetchExchangeDetail = (exchangeId: string) => {
    const url = new URL(exchangeId, new URL(apiPaths.exchanges, APIHost));
    return fetchAPI<JSONExchangeType>(url);
}

// search coins
export const fetchCoinsSearch = (searchString: string) => {
    const url = new URL(apiPaths.coins, APIHost);
    url.searchParams.append('search', searchString);
    return fetchAPI<Array<JSONCoinType>>(url);
}

// get exchange pairs 
export const fetchExchangesPairs = (exchangeId: string) => {
    const url = new URL(apiPaths.markets, APIHost);
    url.searchParams.append('exchangeId', exchangeId);
    return fetchAPI<Array<JSONExchangePairType>>(
        url,
        { useLimit: true, offset: 0 },
        // cached in memory cache
        { next: { revalidate: 0 } }
    );
};