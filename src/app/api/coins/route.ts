import { NextResponse } from 'next/server'
import { fetchCoins } from "@/lib/fetch";

// Caching will be handled with the in memory router,
// as there can be bugs when handling caching with
// more than 1 fetch request per route.
// The NextJS fetch request caching can cache the first request(s),
// but not the subsequent one(s), thus delivering wrong data
export const revalidate = 0;

export async function GET() {
    // custom in memory cache solution
    const cachedData = global?.cacheUser?.get('apiAllCoins');
    if (cachedData !== undefined) {
        const result = {
            status: 'success',
            ...cachedData,
        }
        return NextResponse.json(result, { status: 200 })
    }
    const result = await fetchCoins();
    
    if (result.status === 'success') {
        global?.cacheUser?.set('apiAllCoins', {
            data: result.data,
            timestamp: result.timestamp
        });
        return NextResponse.json(result, { status: 200 });
    } else {
        const statusHTTP = result.error?.status ?? 500;
        return NextResponse.json(result, { status: statusHTTP });
    }
}