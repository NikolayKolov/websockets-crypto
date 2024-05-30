import Coins from "./component";
import { JSONCoinType, JSONResult } from "@/lib/types/genericAPIResponse";

export const revalidate = 30;

export default async function Home() {
    const cachedData = global?.cacheUser?.get('apiAllCoins');
    const isProd = process.env.NODE_ENV === 'production';

    if (cachedData !== undefined) return <Coins initialData={cachedData} />

    const resp = await fetch(`${isProd ? process.env.API_VERCEL_URL : 'http://localhost:3000'}/api/coins/`, { cache: "no-store" });
    const respResult: JSONResult<JSONCoinType[]> = await resp.json();
    
    if (respResult.status === 'error') {
        throw new Error(respResult.error.message);
    }

    return <Coins initialData={{ data: respResult.data, timestamp: respResult.timestamp }} />
}