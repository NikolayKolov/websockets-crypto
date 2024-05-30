import Coins from "./component";
import { JSONCoinType, JSONResult } from "@/lib/types/genericAPIResponse";

export const revalidate = 30;

export default async function Home() {
    const cachedData = global?.cacheUser?.get('apiAllCoins');

    if (cachedData !== undefined) return <Coins initialData={cachedData} />

    const resp = await fetch('http://localhost:3000/api/coins/', { cache: "no-store" });
    const respResult: JSONResult<JSONCoinType[]> = await resp.json();
    
    if (respResult.status === 'error') {
        throw new Error(respResult.error.message);
    }

    return <Coins initialData={{ data: respResult.data, timestamp: respResult.timestamp }} />
}