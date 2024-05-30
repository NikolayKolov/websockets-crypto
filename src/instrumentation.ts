import type NodeCache from 'node-cache';

// Import a NodeJS in memory cache mechanism to store data.
// The built in cache for NextJS doesn't work properly for
// caching routes which make more than one fetch request
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const NodeCache = (await import('node-cache')).default;
        const config: NodeCache.Options = {
            // standard time to live for each cached element in seconds
            stdTTL: 55,
        };

        global.cacheConfigs = new NodeCache(config);
        global.cacheUser = new NodeCache(config);
    }
}