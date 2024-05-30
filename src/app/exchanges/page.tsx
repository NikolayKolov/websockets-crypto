import { fetchExchanges } from "@/lib/fetch";
import ExchangesDataTable from "@/components/tables/ExchangesDataTable";

export const revalidate = 0;

async function Exchanges() {
    const exchanges = await fetchExchanges();
    if (exchanges.status === 'error') throw new Error(exchanges.error.message);

    return (
        <ExchangesDataTable data={exchanges.data} />
    )
}

export default Exchanges;