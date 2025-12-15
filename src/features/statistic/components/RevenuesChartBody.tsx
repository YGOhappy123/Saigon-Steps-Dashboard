import { Bar, CartesianGrid, ComposedChart, Legend, Line, XAxis, YAxis } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { ReportData } from '@/features/statistic/pages/RevenueStatisticPage'

const chartConfig = {
    views: {
        label: 'Số tiền (vnđ)'
    }
} satisfies ChartConfig

type RevenuesChartBodyProps = {
    chartData: ReportData['chart']
    visibleBars: {
        totalSales: boolean
        totalImports: boolean
        totalDamages: boolean
        totalRefunds: boolean
        revenue: boolean
    }
}

const RevenuesChartBody = ({ chartData, visibleBars }: RevenuesChartBodyProps) => {
    return (
        <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
            <ComposedChart
                data={chartData.map((item: any) => ({
                    ...item,
                    revenue: item.totalDamages + item.totalImports + item.totalSales + item.totalRefunds
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
                {visibleBars.totalImports && (
                    <Bar
                        dataKey="totalImports"
                        stackId="a"
                        fill="var(--chart-1)"
                        name="Chi phí nhập hàng"
                        maxBarSize={40}
                    />
                )}
                {visibleBars.totalDamages && (
                    <Bar
                        dataKey="totalDamages"
                        stackId="a"
                        fill="var(--chart-3)"
                        name="Thiệt hại sản phẩm"
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
    )
}

export default RevenuesChartBody
