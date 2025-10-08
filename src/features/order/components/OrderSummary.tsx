import { useQuery } from '@tanstack/react-query'
import useAxiosIns from '@/hooks/useAxiosIns'
import OrderSummaryCard from '@/features/order/components/OrderSummaryCard'
import formatCurrency from '@/utils/formatCurrency'

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
                    .filter(o => o.status === 'PENDING')
                    .length.toString()
                    .padStart(2, '0')}
            />
        </div>
    )
}

export default OrderSummary
