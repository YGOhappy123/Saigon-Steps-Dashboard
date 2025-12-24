import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import orderService from '@/features/order/services/orderService'
import OrderSummary from '@/features/order/components/OrderSummary'
import OrderTable from '@/features/order/components/OrderTable'
import ViewOrderDialog from '@/features/order/components/ViewOrderDialog'
import ProcessOrderDialog from '@/features/order/components/ProcessOrderDialog'
import verifyPermission from '@/utils/verifyPermission'
import permissions from '@/configs/permissions'
import useAxiosIns from '@/hooks/useAxiosIns'

const OrderManagementPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [processDialogOpen, setProcessDialogOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null)
    const hasProcessPermission = verifyPermission(user, permissions.processOrder)
    const orderServiceData = orderService({ enableFetching: true })

    const fetchAllOrderStatusesQuery = useQuery({
        queryKey: ['order-statuses-all'],
        queryFn: () => axios.get<IResponseData<IOrderStatus[]>>('/order-statuses'),
        enabled: true,
        select: res => res.data
    })
    const orderStatuses = fetchAllOrderStatusesQuery.data?.data || []

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách đơn hàng của hệ thống Saigon Steps.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <ViewOrderDialog order={selectedOrder} open={viewDialogOpen} setOpen={setViewDialogOpen} />
            <ProcessOrderDialog
                order={selectedOrder}
                open={processDialogOpen}
                setOpen={setProcessDialogOpen}
                updateStatusMutation={orderServiceData.updateOrderStatusMutation}
            />

            <OrderSummary />
            <OrderTable
                orders={orderServiceData.orders}
                orderStatuses={orderStatuses}
                total={orderServiceData.total}
                page={orderServiceData.page}
                limit={orderServiceData.limit}
                setPage={orderServiceData.setPage}
                setLimit={orderServiceData.setLimit}
                buildQuery={orderServiceData.buildQuery}
                onFilterSearch={orderServiceData.onFilterSearch}
                onResetFilterSearch={orderServiceData.onResetFilterSearch}
                hasProcessPermission={hasProcessPermission}
                onViewOrder={(order: IOrder) => {
                    setSelectedOrder(order)
                    setViewDialogOpen(true)
                }}
                onProcessOrder={(order: IOrder) => {
                    setSelectedOrder(order)
                    setProcessDialogOpen(true)
                }}
                getCsvOrdersQuery={orderServiceData.getCsvOrdersQuery}
            />
        </div>
    )
}

export default OrderManagementPage
