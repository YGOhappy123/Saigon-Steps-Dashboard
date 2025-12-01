import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import useAxiosIns from '@/hooks/useAxiosIns'
import StatisticCompareCard from '@/features/statistic/components/StatisticCompareCard'

type StatisticSummary = {
    currentCount: number
    previousCount: number
}

type StatisticsResponse = {
    customers: StatisticSummary
    orders: StatisticSummary
    revenues: StatisticSummary
}

type StatisticCriteria = 'daily' | 'weekly' | 'monthly' | 'yearly'

const FIXED_STATISTIC_TYPES = [
    { label: 'Hôm nay', value: 'daily' },
    { label: 'Tuần này', value: 'weekly' },
    { label: 'Tháng này', value: 'monthly' },
    { label: 'Năm nay', value: 'yearly' }
]

const SummaryCards = () => {
    const axios = useAxiosIns()
    const [type, setType] = useState<StatisticCriteria>('daily')

    const getSummaryStatisticQuery = useQuery({
        queryKey: ['summary', type],
        queryFn: () => axios.get<IResponseData<StatisticsResponse>>(`/statistics/summary?type=${type}`),
        enabled: true,
        refetchIntervalInBackground: true,
        refetchInterval: 20000,
        select: res => res.data
    })
    const summaryData = getSummaryStatisticQuery.data?.data

    return (
        <Card>
            <CardHeader className="flex items-center justify-between gap-12">
                <div className="flex flex-col justify-center gap-1">
                    <CardTitle className="text-xl">Tóm tắt hoạt động</CardTitle>
                    <CardDescription>
                        Hiển thị số liệu {FIXED_STATISTIC_TYPES.find(item => item.value === type)!.label.toLowerCase()}{' '}
                        so với cùng kỳ trước.
                    </CardDescription>
                </div>
                <div className="grid shrink-0 grid-cols-2 gap-4 xl:grid-cols-4">
                    {FIXED_STATISTIC_TYPES.map(button => (
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

            <CardContent>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <StatisticCompareCard
                        loading={getSummaryStatisticQuery.isLoading}
                        currValue={summaryData?.customers.currentCount ?? 0}
                        prevValue={summaryData?.customers.previousCount ?? 0}
                        label="Khách hàng mới"
                        unit="tài khoản"
                        to="/khach-hang"
                    />
                    <StatisticCompareCard
                        loading={getSummaryStatisticQuery.isLoading}
                        currValue={summaryData?.revenues.currentCount ?? 0}
                        prevValue={summaryData?.revenues.previousCount ?? 0}
                        label="Doanh thu đơn hàng"
                        unit="vnđ"
                        to="/don-hang"
                    />
                    <StatisticCompareCard
                        loading={getSummaryStatisticQuery.isLoading}
                        currValue={summaryData?.orders.currentCount ?? 0}
                        prevValue={summaryData?.orders.previousCount ?? 0}
                        label="Đơn hàng được đặt"
                        unit="đơn"
                        to="/don-hang"
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default SummaryCards
