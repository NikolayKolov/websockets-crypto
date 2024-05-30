import { NextRequest, NextResponse } from 'next/server'
import { fetchExchangesPairs } from "@/lib/fetch";

// Caching will be handled with the in memory router,
// as there can be bugs when handling caching with
// more than 1 fetch request per route.
// The NextJS fetch request caching can cache the first request(s),
// but not the subsequent one(s), thus delivering wrong data
export const revalidate = 0;

export async function GET(_request: NextRequest, { params }: { params: { exchangeId: string } }) {
    const { exchangeId } = params;
    // custom in memory cache solution
    const cachedData = global?.cacheUser?.get('apiExchangePairs_' + exchangeId);
    if (cachedData !== undefined) {
        const result = {
            status: 'success',
            ...cachedData,
        }
        return NextResponse.json(result, { status: 200 })
    }

    if (exchangeId === null) {
        const errorObject = {
            status: 'error',
            error: {
                message: 'Please enter an exchange id',
                status: 500
            }
        }
        return NextResponse.json(errorObject, { status: 500 });
    }

    const result = await fetchExchangesPairs(exchangeId);
    
    if (result.status === 'success') {
        global?.cacheUser?.set('apiExchangePairs_' + exchangeId, {
            data: result.data,
            timestamp: result.timestamp
        });
        return NextResponse.json(result, { status: 200 });
    } else {
        const statusHTTP = result.error?.status ?? 500;
        return NextResponse.json(result, { status: statusHTTP });
    }
}