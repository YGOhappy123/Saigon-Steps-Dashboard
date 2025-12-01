import { useState } from 'react'
import { Bar, CartesianGrid, ComposedChart, Legend, Line, XAxis, YAxis } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { ReportData } from '@/features/customer/components/ViewOrdersStatisticDialog'

const chartConfig = {
    views: {
        label: 'Số tiền (vnđ)'
    }
} satisfies ChartConfig

type OrdersChartProps = {
    chartData: ReportData['chart']
}

const OrdersChart = ({ chartData }: OrdersChartProps) => {
    const [visibleBars, setVisibleBars] = useState({
        totalSales: true,
        totalRefunds: true,
        revenue: true
    })

    const toggleBar = (key: keyof typeof visibleBars) => {
        setVisibleBars(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <Card>
            <div className="flex flex-wrap items-center gap-4 px-6">
                <span className="font-medium">Hiển thị: </span>
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={visibleBars.totalSales}
                        onCheckedChange={() => toggleBar('totalSales')}
                        id="toggle-sales"
                    />
                    <Label htmlFor="toggle-sales">Tiền từ đơn hàng</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={visibleBars.totalRefunds}
                        onCheckedChange={() => toggleBar('totalRefunds')}
                        id="toggle-refunds"
                    />
                    <Label htmlFor="toggle-refunds">Số tiền hoàn trả</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={visibleBars.revenue}
                        onCheckedChange={() => toggleBar('revenue')}
                        id="toggle-revenue"
                    />
                    <Label htmlFor="toggle-revenue">Doanh thu</Label>
                </div>
            </div>

            <CardContent>
                {chartData.length === 0 && <Skeleton className="h-[200px] w-full" />}

                {chartData.length > 0 && (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
                        <ComposedChart
                            data={chartData.map((item: any) => ({
                                ...item,
                                revenue: item.totalSales + item.totalRefunds
                            }))}
                            stackOffset="sign"
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Legend />
                            <ChartTooltip content={<ChartTooltipContent className="w-[200px]" nameKey="views" />} />

                            {visibleBars.totalSales && (
                                <Bar
                                    dataKey="totalSales"
                                    stackId="a"
                                    fill="var(--chart-2)"
                                    name="Tiền từ đơn hàng"
                                    maxBarSize={40}
                                />
                            )}
                            {visibleBars.totalRefunds && (
                                <Bar
                                    dataKey="totalRefunds"
                                    stackId="a"
                                    fill="var(--chart-5)"
                                    name="Số tiền hoàn trả"
                                    maxBarSize={40}
                                />
                            )}
                            {visibleBars.revenue && (
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="var(--chart-4)"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    name="Doanh thu"
                                />
                            )}
                        </ComposedChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}

export default OrdersChart
