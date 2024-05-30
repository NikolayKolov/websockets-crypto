import Link from 'next/link';

export default function CoinLink({ coinId, coinLabel } : { coinId: string, coinLabel: string }) {
    // USD is not a real coin
    if (coinId === 'united-states-dollar') return (
        <span>{coinLabel}</span>
    );

    return (
        <Link href={`/coin/${coinId}`} className='text-reset text-decoration-none'>
            {coinLabel}
        </Link>
    )
}