export type CoinType = {
    id: string,
    rank: number,
    symbol: string,
    name: string,
    supply: number,
    maxSupply: number,
    marketCapUsd: number,
    volumeUsd24Hr: number,
    priceUsd: number,
    changePercent24Hr: number,
    vwap24Hr: number,
}

export type ChartCoinType = {
    priceUsd: number,
    time: number,
    circulatingSupply: number,
    date: string
}

export type DataCoinType = {
    priceUsd: string,
    time: number,
    circulatingSupply: string,
    date: string
}

export type ExchangeType = {
    exchangeId: string,
    name: string,
    rank: number,
    percentTotalVolume: number,
    volumeUsd: number,
    tradingPairs: number,
    socket: boolean | null,
    exchangeUrl: string | null,
    updated: number
}

export type ExchangePairType = {
    exchangeId: string,
    rank: number,
    baseSymbol: string,
    baseId: string,
    quoteSymbol: string,
    quoteId: string,
    priceQuote: number,
    priceUsd: number | null,
    volumeUsd24Hr: number | null,
    percentExchangeVolume: number | null,
    tradesCount24Hr: number | null,
    updated: number
}