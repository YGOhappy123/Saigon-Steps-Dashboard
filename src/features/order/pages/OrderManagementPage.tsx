import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import orderService from '@/features/order/services/orderService'
import OrderSummary from '@/features/order/components/OrderSummary'
import OrderGrid from '@/features/order/components/OrderGrid'
import verifyPermission from '@/utils/verifyPermission'
import permissions from '@/configs/permissions'

const OrderManagementPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const hasUpdatePermission = verifyPermission(user, permissions.processOrder)
    const orderServiceData = orderService({ enableFetching: true })

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

            <OrderSummary />

            <OrderGrid
                orders={orderServiceData.orders}
                total={orderServiceData.total}
                page={orderServiceData.page}
                limit={orderServiceData.limit}
                setPage={orderServiceData.setPage}
                setLimit={orderServiceData.setLimit}
                buildQuery={orderServiceData.buildQuery}
                onFilterSearch={orderServiceData.onFilterSearch}
                onResetFilterSearch={orderServiceData.onResetFilterSearch}
                hasUpdatePermission={hasUpdatePermission}
                getCsvOrdersQuery={orderServiceData.getCsvOrdersQuery}
                updateStatusMutation={orderServiceData.updateOrderStatusMutation}
            />
        </div>
    )
}

export default OrderManagementPage
