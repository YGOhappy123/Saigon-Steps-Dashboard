import { useQuery } from '@tanstack/react-query'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import useAxiosIns from '@/hooks/useAxiosIns'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

const OrderSummary = () => {
    const axios = useAxiosIns()

    const fetchAllOrdersQuery = useQuery({
        queryKey: ['orders-all'],
        queryFn: () => axios.get<IResponseData<IOrder[]>>('/orders'),
        enabled: true,
        refetchInterval: 30000,
        select: res => res.data
    })
    const orders = fetchAllOrdersQuery.data?.data || []

    return (
        <div className="grid grid-cols-3 gap-6">
            <OrderSummaryCard title="Số lượng đơn hàng" data={orders.length.toString().padStart(2, '0')} />
            <OrderSummaryCard
                title="Tổng doanh thu đơn hàng"
                data={formatCurrency(
                    orders
                        .filter(o => o.deliveredAt != null && o.refundedAt == null)
                        .reduce((acc, cur) => acc + cur.totalAmount, 0)
                )}
            />
            <OrderSummaryCard
                title="Số đơn hàng đang chờ xử lý"
                data={orders
                    .filter(o => o.status.isDefault === true)
                    .length.toString()
                    .padStart(2, '0')}
            />
        </div>
    )
}

type OrderSummaryCardProps = {
    title: string
    data: number | string
}

const OrderSummaryCard = ({ title, data }: OrderSummaryCardProps) => {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{data}</CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">Ngày tổng hợp số liệu</div>
                <div className="text-muted-foreground">{dayjs().format('DD/MM/YYYY - HH:mm:ss')}</div>
            </CardFooter>
        </Card>
    )
}

export default OrderSummary
