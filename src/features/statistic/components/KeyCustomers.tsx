import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { StatisticCriteria, statisticTypes } from '@/features/statistic/pages/RevenueStatisticPage'
import HighestOrderCountTable from '@/features/statistic/components/HighestOrderCountTable'
import HighestOrderAmountTable from '@/features/statistic/components/HighestOrderAmountTable'
import useAxiosIns from '@/hooks/useAxiosIns'

type KeyCustomers = {
    highestOrderCountCustomers: (ICustomer & { orderCount: number })[]
    highestSpendingCustomers: (ICustomer & { orderAmount: number })[]
}

const KeyCustomers = () => {
    const axios = useAxiosIns()
    const [type, setType] = useState<StatisticCriteria>('daily')

    const getKeyCustomersQuery = useQuery({
        queryKey: ['key-customers', type],
        queryFn: () => axios.get<IResponseData<KeyCustomers>>(`/statistics/key-customers?type=${type}`),
        enabled: true,
        refetchIntervalInBackground: true,
        refetchInterval: 20000,
        select: res => res.data
    })
    const keyCustomers = getKeyCustomersQuery.data?.data

    return (
        <Card className="col-span-6">
            <CardHeader className="flex items-center justify-between gap-12">
                <div className="flex flex-col justify-center gap-1">
                    <CardTitle className="text-xl">Khách hàng nổi bật</CardTitle>
                    <CardDescription>
                        Hiển thị danh sách khách hàng nổi bật trong{' '}
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

            <CardContent>
                {keyCustomers == null && <Skeleton className="h-[200px] w-full" />}

                {keyCustomers != null && (
                    <div className="flex flex-col gap-6">
                        <HighestOrderCountTable customers={keyCustomers.highestOrderCountCustomers ?? []} />
                        <HighestOrderAmountTable customers={keyCustomers.highestSpendingCustomers ?? []} />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default KeyCustomers
