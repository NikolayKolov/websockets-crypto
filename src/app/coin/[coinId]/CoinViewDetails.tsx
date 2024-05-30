"use client";

import React, { useEffect, useRef, useState } from 'react';
import CoinChart from '@/components/charts/CoinChart';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import CoinDataSkeleton from '@/components/common/LoadingSkeletons/CoinDataSkeleton';
import CoinViewError from '@/components/tables/CoinsDataTable/components/CoinViewError';
import CoinSummaryData from '@/components/tables/components/CoinSummaryData';
import useChartData, { chartPeriods } from '@/hooks/useChartData';
import NoDataToDisplay from '@/components/common/NoDataToDisplay';

export default function CoinViewDetail({ params }: { params: { coinId: string, name: string, symbol: string } }) {
    const { coinId, name, symbol } = params;
    const webSocketRef = useRef<WebSocket | null>(null);
    const [latestPrice, setLatestPrice] = useState<{ x: number, y?: number}>({ x: Date.now(), y: undefined})

    useEffect(() => {
        let cancel = false;
        
        const handleWebSocketMessage = (event: MessageEvent) => {
            const messageData = JSON.parse(event.data);
            Object.keys(messageData).forEach(coin => {
                if (coin === coinId) {
                    setLatestPrice({
                        x: Date.now(),
                        y: Number(messageData[coin])
                    })
                }
            })
        }

        if (!cancel) {
            webSocketRef.current = new WebSocket((process.env.NEXT_PUBLIC_API_WEBSOCKET_COINS as string) + '?assets=' + coinId);
            webSocketRef.current.addEventListener('message', handleWebSocketMessage)
        }

        return () => {
            if (webSocketRef.current !== null && webSocketRef.current.readyState !== webSocketRef.current.CLOSED) {
                cancel = true;
                webSocketRef.current.removeEventListener('message', handleWebSocketMessage);
                webSocketRef.current.close();
                webSocketRef.current = null;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { isLoading, isValidating, error, chartData, chartPeriod, setChartPeriod } = useChartData({ coinId, interval: '1h' });

    // show loading only on first fetch
    if (isLoading && chartData === null) return <CoinDataSkeleton />;

    if (error) return <CoinViewError error={error.error} />;

    return (
        <Container fluid>
            <CoinSummaryData data={chartData ?? []} coinResp={{ name: name, symbol: symbol }} />
            <Row>
                <Col xs={12}>
                    {
                        chartData && chartData?.length > 0 ?
                            <>
                                <CoinChart chartData={chartData} period={chartPeriod} referencePoint={latestPrice} />
                                <Stack direction="horizontal" gap={1} className='mt-2'>
                                    {
                                        Object.keys(chartPeriods).map((key) => {
                                            const keyTyped = key as keyof typeof chartPeriods;
                                            let classPill = 'badge ';
                                            if (isValidating) classPill+='text-bg-secondary';
                                            else if (keyTyped === chartPeriod) classPill+='text-bg-primary';
                                            else classPill+='text-bg-secondary';
                                            return (
                                                <span key={keyTyped} className={classPill} style={{cursor: 'pointer'}} onClick={() => !isValidating && setChartPeriod(keyTyped)}>
                                                    {
                                                        isValidating && keyTyped === chartPeriod && <div className="spinner-border spinner-border-sm" role="status" style={{height: '12px', width: '12px'}}>
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    }
                                                    {chartPeriods[keyTyped].label}
                                                </span>
                                            );
                                        })
                                    }
                                    
                                </Stack>
                            </> :
                            <NoDataToDisplay />
                    }
                </Col>
            </Row>
        </Container>
    );
}