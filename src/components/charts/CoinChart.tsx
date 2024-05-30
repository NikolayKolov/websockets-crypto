import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { formatCurrencyDynamicFractions } from '@/components/tables/utils/numberFormatter';

type ChartCoinType = {
    priceUsd: number,
    time: number,
    circulatingSupply: number,
    date: string
}

type ReferencePointType = {
    x: number,
    y?: number,
}

type ViewBoxType = {
    x: number,
    y: number,
    width: number,
    height: number
}

const CoinChart = ({ chartData, referencePoint, period = '1d' }: {
    chartData: Array<ChartCoinType>,
    referencePoint?: ReferencePointType,
    period?: string }) => {
    
    const renderCustomLabel = ({viewBox} : { viewBox: ViewBoxType}) => {
        return (
            <g>
                <foreignObject x={0} y={viewBox.y - 28} width={100} height={56}>
                    <p className='d-flex justify-content-center align-items-center w-100 h-100 bg-primary-subtle border border-2 rounded border-primary-subtle opacity-75'>
                    Latest price: <br />
                        {`${formatCurrencyDynamicFractions(referencePoint?.y ?? 0)}`}</p>
                </foreignObject>
            </g>
        );
    };

    const filterTicks = (elem: ChartCoinType): boolean => {
        if (chartData && chartData?.length) {
            if (period === '1h') {
                return elem.time % (5*60*1000) === 0
            } else if (period === '1d') {
                return elem.time % (60*60*1000) === 0
            } else if (period === '1w') {
                return elem.time % (24*60*60*1000) === 0
            } else if (period === '1m') {
                return elem.time % (3*24*60*60*1000) === 0
            } else if (period === '3m') {
                return elem.time % (7*24*60*60*1000) === 0
            } else if (period === '6m') {
                return elem.time % (14*24*60*60*1000) === 0
            } else if (period === '1y') {
                return elem.time % (31*24*60*60*1000) === 0
            } else return elem.time % (92*24*60*60*1000) === 0
        } else return false;
    };

    const tickFormatter = (value: number) => {
        if (chartData && chartData?.length) {
            if (period === '1h' || period === '1d') {
                return new Date(value).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                })
            } else if (period === '1w') {
                return new Date(value).toLocaleDateString([], {
                    month: 'short',
                    day: '2-digit',
                })
            } else if (period === '1m' || period === '3m' || period === '6m') {
                return new Date(value).toLocaleDateString([], {
                    month: 'short',
                    day: '2-digit'
                })
            } else if (period === '1y') {
                return new Date(value).toLocaleDateString([], {
                    year: '2-digit',
                    month: 'short',
                })
            } else return new Date(value).toLocaleDateString([], {
                year: 'numeric',
            })
        } else return new Date(value).toLocaleTimeString([], {
            year: '2-digit',
            month: 'short',
            day: '2-digit',
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    }

    return (
        <ResponsiveContainer minHeight={200} aspect={7 / 3}>
            <AreaChart data={chartData} margin={{ top: 24, right: 0, left: 48, bottom: 0 }}>
                <XAxis
                    dataKey="time"
                    ticks={chartData && chartData?.length ?
                        chartData?.filter(filterTicks).map(el => el.time) :
                        [0]
                    }
                    tickFormatter={tickFormatter}
                    allowDataOverflow={true} />
                <YAxis
                    dataKey="priceUsd"
                    domain={[(dataMin: number) => dataMin * 0.998, (dataMax: number) => dataMax * 1.002]}
                    allowDataOverflow={true}
                    tickFormatter={(value) => formatCurrencyDynamicFractions(value)} />
                <Area
                    type="monotone"
                    dataKey="priceUsd"
                    fillOpacity={0.5}
                    viewBox=''
                    stroke={chartData && (chartData[chartData.length - 1]?.priceUsd - chartData[0]?.priceUsd) > 0 ?
                        '#198754' : '#dc3545'}
                    strokeWidth={3}
                    fill={chartData && (chartData[chartData.length - 1]?.priceUsd - chartData[0]?.priceUsd) > 0 ?
                        '#198754' : '#dc3545'} />
                <Tooltip
                    wrapperClassName='bg-secondary-subtle'
                    formatter={(value: number) => [formatCurrencyDynamicFractions(value), 'Price']}
                    labelFormatter={(value: number) => new Date(value).toLocaleTimeString([], {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    })} />
                {
                    (referencePoint && referencePoint?.y) && <ReferenceLine
                        ifOverflow={referencePoint?.y ? 'extendDomain' : 'hidden'}
                        stroke='blue'
                        strokeWidth={2}
                        label={renderCustomLabel}
                        y={referencePoint?.y}
                        x={referencePoint.x} />
                }
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default CoinChart;