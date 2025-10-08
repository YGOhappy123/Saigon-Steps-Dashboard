import { useState } from 'react'
import { UseQueryResult } from '@tanstack/react-query'
import { FileSpreadsheet, Funnel } from 'lucide-react'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { exportToCSV } from '@/utils/exportCsvFile'
import { OrderSortAndFilterParams } from '@/features/order/services/orderService'
import { ORDER_STATUS_MAP } from '@/configs/constants'
import PageLimitSelect from '@/components/common/PageLimitSelect'
import OrderFilter from '@/features/order/components/OrderFilter'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type OrderGridToolbarProps = {
    limit: number
    setLimit: (limit: number) => void
    getCsvOrdersQuery: UseQueryResult<any, any>
    buildQuery: (params: OrderSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
}

const OrderGridToolbar = ({
    getCsvOrdersQuery,
    limit,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch
}: OrderGridToolbarProps) => {
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        getCsvOrdersQuery.refetch().then(res => {
            const csvOrders = res.data?.data?.data ?? []
            const formattedOrders = csvOrders.map((order: IOrder) => ({
                ['Mã đơn hàng']: order.orderId,
                ['Khách hàng']: order.customer.name,
                ['Trạng thái hiện tại']: ORDER_STATUS_MAP[order.status],
                ['Tổng giá trị (VNĐ)']: formatCurrency(order.totalAmount),
                ['Thời gian đặt hàng']: dayjs(order.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                ['Thời gian giao hàng']: order.deliveredAt
                    ? dayjs(order.deliveredAt).format('DD/MM/YYYY HH:mm:ss')
                    : 'Chưa giao hàng',
                ['Thời gian đổi trả']: order.refundedAt
                    ? dayjs(order.refundedAt).format('DD/MM/YYYY HH:mm:ss')
                    : 'Không có'
            }))

            exportToCSV(formattedOrders, `SS_danh_sach_don_hang ${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`, [
                { wch: 15 },
                { wch: 30 },
                { wch: 20 },
                { wch: 20 },
                { wch: 30 },
                { wch: 30 },
                { wch: 30 }
            ])
        })
    }

    return (
        <div className="flex items-center justify-between">
            <PageLimitSelect limit={limit} setLimit={setLimit} />

            <div className="flex justify-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="relative">
                            <Funnel />
                            Lọc đơn hàng
                            {havingFilters && (
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <OrderFilter
                        setHavingFilters={setHavingFilters}
                        onChange={buildQuery}
                        onSearch={onFilterSearch}
                        onReset={onResetFilterSearch}
                    />
                </Popover>

                <Button onClick={exportCsvFile}>
                    <FileSpreadsheet /> Xuất file CSV
                </Button>
            </div>
        </div>
    )
}

export default OrderGridToolbar
