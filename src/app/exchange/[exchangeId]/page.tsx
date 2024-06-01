"use client";

import { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Rank from '@/components/common/Rank';
import RowDetail from '@/components/common/RowDetail';
import { formatCurrencyDynamicFractions } from '@/components/tables/utils/numberFormatter';
import useExchangeData from '@/hooks/useExchangeData';
import useExchangePairsData from '@/hooks/useExchangePairsData';
import ExchangePairsTable from '@/components/tables/ExchangePairsTable';
import CoinDataSkeleton from "@/components/common/LoadingSkeletons/CoinDataSkeleton";
import TableSkeleton from '@/components/common/LoadingSkeletons/TableSkeleton';
import NoDataToDisplay from '@/components/common/NoDataToDisplay';
import CoinViewError from '@/components/tables/CoinsDataTable/components/CoinViewError';

export default function CoinView({ params }: { params: {exchangeId: string}}) {
    const { exchangeId } = params; 
    const { isLoading, error, exchangeDetails} = useExchangeData({ exchangeId });
    const { isLoading: isLoadingPairs, isValidating: isValidatingPairs, error: errorPairs, exchangePairs: pairsData } = useExchangePairsData({ exchangeId });

    let name = '-';
    let pairs = 0;
    let rank = '-';
    let volume = '-';
    let topPair = 'N/A';

    useEffect(() => {
        if (isLoading) {
            document.title = 'Loading...';
        } else {
            document.title = name;
        }
    }, [name, isLoading]);

    if (isLoading) return (<CoinDataSkeleton />);

    if (error) throw new Error(error.message);

    if (exchangeDetails !== null) {
        name = exchangeDetails.name;
        pairs = exchangeDetails.tradingPairs;
        rank = exchangeDetails.rank.toString();
        volume = formatCurrencyDynamicFractions(Number(exchangeDetails.volumeUsd), { notation: 'compact'});
    }

    if (pairsData !== null && pairsData?.length) {
        const firstPair = pairsData.filter(pair => pair.rank === 1)[0];
        topPair = `${firstPair.baseSymbol}/${firstPair.quoteSymbol}`;
    }

    return (
        <Container fluid className='mt-4'>
            <Row>
                <Col xs={12} lg={6} xl={4} className='d-flex'>
                    <Rank rankNumber={rank} />
                    <Stack gap={2} className='flex-grow-0 ps-5'>
                        <div className='text-capitalize fs-3 fw-bold'>{name}</div>
                        <div className='text-capitalize fs-3 fw-bold'>
                            {pairs}
                            <span className='ms-2 fs-5'>pairs</span>
                        </div>
                    </Stack>
                </Col>
                <Col xs={12} lg={6} xl={8}>
                    <Container fluid className='mt-4 mt-lg-0'>
                        <Row>
                            <Col xs={6} md={4}>
                                <RowDetail title="Volume (24Hr)" value={volume} />
                            </Col>
                            <Col xs={6} md={4}>
                                <RowDetail title="Top Pair" value={topPair} />
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
            <Row>
                <Col xs={12} className="mt-4">
                    { (isLoadingPairs || isValidatingPairs) && pairsData === null ? <TableSkeleton /> : null }
                    {
                        pairsData !== null && pairsData.length > 0 ?
                            <ExchangePairsTable data={pairsData} /> :
                            errorPairs ? 
                                <CoinViewError error={errorPairs.message} /> :
                                <NoDataToDisplay />
                    }
                </Col>
            </Row>
        </Container>
    );
}