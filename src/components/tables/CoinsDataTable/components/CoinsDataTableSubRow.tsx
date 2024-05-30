import React, { useEffect, useState } from 'react';
import { CoinType } from '@/lib/types/tableTypes';
import CoinChart from '@/components/charts/CoinChart';
import NextLinkLegacy from '@/components/common/Links/NextLinkLegacy';
import useChartData from '@/hooks/useChartData';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SubRowSkeleton from '../../../common/LoadingSkeletons/CoinDataSkeleton';
import CoinViewError from './CoinViewError';
import CoinSummaryData from '../../components/CoinSummaryData';
import NoDataToDisplay from '@/components/common/NoDataToDisplay';

type SubRowProps = {
    row: CoinType,
    webSocketRef: WebSocket | null
}

const CoinsDataTableSubRow = ({ row, webSocketRef }: SubRowProps) => {
    const [latestPrice, setLatestPrice] = useState<{ x: number, y?: number}>({ x: Date.now(), y: undefined})
    const { isLoading, error, chartData } = useChartData({ coinId: row.id })

    useEffect(() => {
        const handleWebSocketMessage = (event: MessageEvent) => {
            const messageData = JSON.parse(event.data);
            Object.keys(messageData).forEach(coin => {
                if (coin === row.id) {
                    setLatestPrice({
                        x: Date.now(),
                        y: Number(messageData[coin])
                    })
                }
            })
        }

        if (webSocketRef !== null) {
            webSocketRef.addEventListener('message', handleWebSocketMessage)
        }

        return () => {
            webSocketRef?.removeEventListener('message', handleWebSocketMessage);
        }
    }, []);

    if (isLoading && chartData === null) return <SubRowSkeleton />;

    if (error) return <CoinViewError error={error.error} />;

    return (
        <Container fluid>
            <CoinSummaryData data={chartData ?? []} coinResp={{name: row.name, symbol: row.symbol}} />
            <Row>
                <Col xs={12}>
                    {
                        chartData && chartData?.length > 0 ?
                            <CoinChart chartData={chartData} referencePoint={latestPrice}/> :
                            <NoDataToDisplay />
                    }
                </Col>
            </Row>
            <Row>
                <Col xs={12} className='d-flex align-items-center justify-content-center py-4'>
                    <NextLinkLegacy href={`/coin/${row.id}`}>
                        <a className="btn btn-outline-primary">More Details</a>
                    </NextLinkLegacy>
                </Col>
            </Row>
        </Container>
    )
}

export default React.memo(CoinsDataTableSubRow);