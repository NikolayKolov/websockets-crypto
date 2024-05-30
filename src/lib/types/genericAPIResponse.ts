export type JSONCoinType = {
    id: string,
    rank: string,
    symbol: string,
    name: string,
    supply: string | null,
    maxSupply: string | null,
    marketCapUsd: string | null,
    volumeUsd24Hr: string | null,
    priceUsd: string | null,
    changePercent24Hr: string | null,
    vwap24Hr: string | null,
}

export type JSONExchangeType = {
    exchangeId: string,
    name: string,
    rank: string,
    percentTotalVolume: string | null,
    volumeUsd: string | null,
    tradingPairs: string | null,
    socket: boolean | null,
    exchangeUrl: string | null,
    updated: number
}

export type JSONAssetHistoryType = {
    priceUsd: string,
    time: number,
    circulatingSupply: string,
    date: string
}

export type JSONExchangePairType = {
    exchangeId: string,
    rank: string,
    baseSymbol: string,
    baseId: string,
    quoteSymbol: string,
    quoteId: string,
    priceQuote: string,
    priceUsd: string | null,
    volumeUsd24Hr: string | null,
    percentExchangeVolume: string | null,
    tradesCount24Hr: string | null,
    updated: number
}

export type JSONResult<Type> = {
    status: 'success',
    data: Type,
    timestamp: number
} | {
    status: 'error'
    error: {
        message: string,
        status?: number
    }
}