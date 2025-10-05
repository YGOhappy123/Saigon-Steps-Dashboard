import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Bar, CartesianGrid, ComposedChart, Legend, Line, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { StatisticCriteria, statisticTypes } from '@/features/statistic/pages/RevenueStatisticPage'
import useAxiosIns from '@/hooks/useAxiosIns'

const chartConfig = {
    views: {
        label: 'Số tiền (vnđ)'
    }
} satisfies ChartConfig

const RevenueChart = () => {
    const axios = useAxiosIns()
    const [type, setType] = useState<StatisticCriteria>('daily')

    const [visibleBars, setVisibleBars] = useState({
        totalSales: true,
        totalImports: true,
        totalDamages: true,
        totalRefunds: true,
        revenue: true
    })

    const toggleBar = (key: keyof typeof visibleBars) => {
        setVisibleBars(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const getRevenueChartQuery = useQuery({
        queryKey: ['revenue-chart', type],
        queryFn: () => axios.get<IResponseData<any>>(`/statistics/revenues?type=${type}`),
        enabled: true,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 20000,
        select: res => res.data
    })
    const chartData = getRevenueChartQuery.data?.data ?? []

    return (
        <Card className="col-span-6">
            <CardHeader className="flex items-center justify-between gap-12">
                <div className="flex flex-col justify-center gap-1">
                    <CardTitle className="text-xl">Biểu đồ doanh thu</CardTitle>
                    <CardDescription>
                        Hiển thị doanh thu của cửa hàng trong{' '}
                        {statisticTypes.find(item => item.value === type)!.label.toLowerCase()}.
                    </CardDescription>
                </div>
                <div className="grid shrink-0 grid-cols-2 gap-4 xl:grid-cols-4">
                    {statisticTypes.map(button => (
                        <Button
                            key={button.value}
                            variant={type === button.value ? 'default' : 'outline'}
                            size="lg"
                            onClick={() => setType(button.value as StatisticCriteria)}
                            className="w-[120px]"
                        >
                            {button.label}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <Separator />

            <div className="flex flex-wrap items-center gap-4 px-6">
                <span>Hiển thị: </span>
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
                        checked={visibleBars.totalImports}
                        onCheckedChange={() => toggleBar('totalImports')}
                        id="toggle-imports"
                    />
                    <Label htmlFor="toggle-imports">Chi phí nhập hàng</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={visibleBars.totalDamages}
                        onCheckedChange={() => toggleBar('totalDamages')}
                        id="toggle-damages"
                    />
                    <Label htmlFor="toggle-damages">Thiệt hại sản phẩm</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={visibleBars.totalRefunds}
                        onCheckedChange={() => toggleBar('totalRefunds')}
                        id="toggle-refunds"
                    />
                    <Label htmlFor="toggle-refunds">Tổng tiền hoàn trả</Label>
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
                                    name="Tổng tiền hoàn trả"
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

export default RevenueChart
