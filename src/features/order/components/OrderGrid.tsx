import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { Avatar as RadixAvatar, AvatarImage as RadixAvatarImage } from '@radix-ui/react-avatar'
import { OrderSortAndFilterParams } from '@/features/order/services/orderService'
import OrderCard from '@/features/order/components/OrderCard'
import OrderGridToolbar from '@/features/order/components/OrderGridToolbar'
import Pagination from '@/components/common/Pagination'

type OrderGridProps = {
    orders: IOrder[]
    orderStatuses: IOrderStatus[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    buildQuery: (params: OrderSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasUpdatePermission: boolean
    getCsvOrdersQuery: UseQueryResult<any, any>
    updateStatusMutation: UseMutationResult<any, any, { orderId: number; data: { statusId: number } }, any>
}

const OrderGrid = ({
    orders,
    orderStatuses,
    total,
    page,
    limit,
    setPage,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    hasUpdatePermission,
    getCsvOrdersQuery,
    updateStatusMutation
}: OrderGridProps) => {
    const lastPage = Math.ceil(total / limit)

    return (
        <div className="flex flex-col gap-8">
            <OrderGridToolbar
                limit={limit}
                setLimit={setLimit}
                getCsvOrdersQuery={getCsvOrdersQuery}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
                orderStatuses={orderStatuses}
            />

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                {orders.map(order => (
                    <OrderCard
                        key={order.orderId}
                        order={order}
                        hasPermission={hasUpdatePermission}
                        updateStatusMutation={updateStatusMutation}
                    />
                ))}

                {orders.length === 0 && (
                    <div className="col-span-2 flex flex-1 flex-col items-center justify-center gap-2 py-20">
                        <RadixAvatar className="w-[30%] xl:w-[20%]">
                            <RadixAvatarImage src="/images/happy-emoji.png" alt="empty cart"></RadixAvatarImage>
                        </RadixAvatar>
                        <p className="mt-2 text-center font-semibold">Không có đơn hàng</p>
                        <p className="text-center font-semibold">
                            Hệ thống Saigon Steps không tìm thấy đơn hàng nào theo các tiêu chí bạn đã chọn!
                        </p>
                    </div>
                )}
            </div>

            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default OrderGrid
