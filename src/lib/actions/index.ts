"use server";

import { fetchCoinsSearch, fetchExchanges } from "../fetch";

export const search = async (_state: { status: string, data: any; }, formData: FormData) => {
    const seachTerm = formData.get('search')?.toString() ?? '';
    const [coins, exchanges] = await Promise.all([fetchCoinsSearch(seachTerm), fetchExchanges()]);
    
    const resultData = {
        coins: { status: 'error', data: [] as any[] },
        exchanges: { status: 'error', data: [] as any[] }
    };
    if (coins.status === 'success' && Array.isArray(coins.data)) {
        resultData.coins.status = 'success';
        resultData.coins.data = coins.data;
    }
    if (exchanges.status === 'success' && Array.isArray(exchanges.data)) {
        resultData.exchanges.status = 'success';
        const filteredExchanges = exchanges.data.filter(el => el.name.toLowerCase().includes(seachTerm.toLowerCase()));
        resultData.exchanges.data = filteredExchanges;
    }

    return {
        status: 'done',
        data: resultData
    };
}
