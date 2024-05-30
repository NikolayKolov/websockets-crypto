import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from "react-bootstrap/Stack";
import IconImageFallback from '@/components/common/IconImageFallback';
import { formatCurrencyDynamicFractions, formatPercentage } from '@/components/tables/utils/numberFormatter';

import styles from './coinSummary.module.scss';

type ChartCoinType = {
    priceUsd: number,
    time: number,
    circulatingSupply: number,
    date: string
}

export default function CoinSummaryData({ data, coinResp }: { 
    data: Array<ChartCoinType>, 
    coinResp: { name: string, symbol: string } }) {
    const nowUTC = new Date(Date.now());
    const offset = nowUTC.getTimezoneOffset();
    const nowLocal = new Date(nowUTC.getTime() + offset * 60 * 1000);

    let minPrice = '0';
    let maxPrice = '0';
    let avgPrice = '0';
    let percentChange = '0%';

    if (data && data.length) {
        const sorterArray = [...data].sort((a, b) => Number(a.priceUsd) - Number(b.priceUsd));
        minPrice = formatCurrencyDynamicFractions(sorterArray[0].priceUsd);
        maxPrice = formatCurrencyDynamicFractions(sorterArray[sorterArray.length - 1].priceUsd);
        avgPrice = formatCurrencyDynamicFractions(data.reduce((acc, currVal) => acc + Number(currVal.priceUsd), 0) / data.length);
        percentChange = formatPercentage((data[data.length - 1].priceUsd - data[0].priceUsd) / data[0].priceUsd * 100);
    }

    return (
        <>
            <Row className='p-3'>
                <Col xs={12} md={4} className={`${styles.justifyCoinCenter} d-flex align-items-center mb-4 mb-md-0`}>
                    <IconImageFallback
                        src={`/icons/coins/${coinResp.symbol.toLowerCase()}.svg`}
                        fallbackSrc='/icons/coins/btc++.svg'
                        alt={coinResp.name}
                        height={64}
                        width={64}
                        className='me-5' />
                    <Stack gap={2} className='flex-grow-0'>
                        <div className='text-uppercase fs-5 fw-bold'>{`${coinResp.name} (${coinResp.symbol})`}</div>
                        <div className='fw-light'>{nowLocal.toLocaleDateString(undefined, {day: '2-digit', month: 'short', year: 'numeric'})}</div>
                    </Stack>
                </Col>
                <Col xs={6} md={4}>
                    <Stack gap={2} className={styles.firstColumn}>
                        <div className='text-uppercase'>
                            <span>High</span>
                            <span className='fw-bold'>{maxPrice}</span>
                        </div>
                        <div className='text-uppercase'>
                            <span>Low</span>
                            <span className='fw-bold'>{minPrice}</span>
                        </div>
                    </Stack>
                </Col>
                <Col xs={6} md={4}>
                    <Stack gap={2} className={styles.firstColumn}>
                        <div className='text-uppercase'>
                            <span>Average</span>
                            <span className='fw-bold'>{avgPrice}</span>
                        </div>
                        <div className='text-uppercase'>
                            <span>Change</span>
                            <span className={`fw-bold ${data && (data[data.length - 1]?.priceUsd - data[0]?.priceUsd) > 0 ? 'text-success' : 'text-danger'}`}>{percentChange}</span>
                        </div>
                    </Stack>
                </Col>
            </Row>
        </>
    );
}