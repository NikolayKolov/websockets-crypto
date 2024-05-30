import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Rank from '@/components/common/Rank';
import RowDetail from '@/components/common/RowDetail';
import { fetchCoinDetail } from "@/lib/fetch";
import { formatCurrencyDynamicFractions, formatPercentage, formatNumber } from '@/components/tables/utils/numberFormatter';
import CoinViewDetail from './CoinViewDetails';

export default async function CoinView({ params }: { params: {coinId: string}}) {
    const { coinId } = params;
    const coinDetails = await fetchCoinDetail(coinId);
    if (coinDetails.status === 'error') throw new Error(coinDetails.error.message);

    const coinData = coinDetails.data;
    const currPrice = formatCurrencyDynamicFractions(Number(coinData.priceUsd));
    const percentChange = formatPercentage(Number(coinData.changePercent24Hr));
    const marketCap = formatCurrencyDynamicFractions(Number(coinData.marketCapUsd), { notation: 'compact'});
    const volume = formatCurrencyDynamicFractions(Number(coinData.volumeUsd24Hr), { notation: 'compact' });
    const supply = formatNumber(Number(coinData.supply));

    return (
        <Container fluid className='mt-4'>
            <Row>
                <Col xs={12} lg={6} xl={4} className='d-flex'>
                    <Rank rankNumber={coinData.rank} />
                    <Stack gap={2} className='flex-grow-0 ps-5'>
                        <div className='text-capitalize fs-3 fw-bold'>{`${coinData.name} (${coinData.symbol})`}</div>
                        <div className='text-capitalize fs-3 fw-bold'>
                            {`${currPrice}`}
                            <span className={`ms-2 fs-5 ${Number(coinData.changePercent24Hr) > 0 ? 'text-success' : 'text-danger'}`}>
                                {`${percentChange}`}
                            </span>
                        </div>
                    </Stack>
                </Col>
                <Col xs={12} lg={6} xl={8}>
                    <Container fluid className='mt-4 mt-lg-0'>
                        <Row>
                            <Col xs={6} md={4}>
                                <RowDetail title='Market Cap' value={marketCap} />
                            </Col>
                            <Col xs={6} md={4}>
                                <RowDetail title='Volume (24Hr)' value={volume} />
                            </Col>
                            <Col xs={6} md={4} className='mt-2 mt-md-0'>
                                <RowDetail title='Supply' value={supply} />
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
            <Row>
                <Col xs={12} className="mt-4">
                    <CoinViewDetail params={{ coinId, name: coinData.name, symbol: coinData.symbol }}/>
                </Col>
            </Row>
        </Container>
    );
}