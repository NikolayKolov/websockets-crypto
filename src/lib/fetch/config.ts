const apiPaths = {
    coins: "assets/",
    exchanges: "exchanges/",
    markets: "markets/"
}

export const apiConfigs = {
    // The APi has a limit of 2000 items returned per request
    limitItemsPerRequest: 2000,
    // Cache the API data for 30 seconds by default
    keepCacheSeconds: 30
} 

export default apiPaths;