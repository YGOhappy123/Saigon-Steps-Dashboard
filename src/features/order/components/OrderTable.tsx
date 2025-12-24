import { UseQueryResult } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { BadgeDollarSign, ClockArrowUp, MoreHorizontal, Package, Truck, Store } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrderSortAndFilterParams } from '@/features/order/services/orderService'
import OrderTableToolbar from '@/features/order/components/OrderTableToolbar'
import Pagination from '@/components/common/Pagination'
import InvoicePDF from '@/features/order/components/InvoicePDF'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

const deliveryMethodTypes = [
    {
        value: true,
        label: 'Vận chuyển qua đường bưu điện',
        icon: Truck
    },
    {
        value: false,
        label: 'Nhận trực tiếp tại cửa hàng',
        icon: Store
    }
]

type OrderTableProps = {
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
    hasProcessPermission: boolean
    onViewOrder: (value: IOrder) => void
    onProcessOrder: (value: IOrder) => void
    getCsvOrdersQuery: UseQueryResult<any, any>
}

const OrderTable = ({
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
    hasProcessPermission,
    onViewOrder,
    onProcessOrder,
    getCsvOrdersQuery
}: OrderTableProps) => {
    const columns: ColumnDef<IOrder>[] = [
        {
            accessorKey: 'orderId',
            header: () => <div className="text-center">Mã đơn hàng</div>,
            cell: ({ row }) => <div>{row.original.orderId}</div>
        },
        {
            id: 'orderInfo',
            header: () => <div>Thông tin tổng quan</div>,
            cell: ({ row }) => {
                const productItems = row.original.orderItems || []
                return (
                    <div className="flex max-w-[300px] flex-col gap-2 break-words whitespace-normal">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Số lượng sản phẩm: </span>
                            <Badge variant="default">
                                <Package />{' '}
                                {productItems
                                    .reduce((total, item) => total + item.quantity, 0)
                                    .toString()
                                    .padStart(2, '0')}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Tổng tiền: </span>
                            <Badge variant="success">
                                <BadgeDollarSign /> {formatCurrency(row.original.totalAmount)}
                            </Badge>
                        </div>
                        <p>
                            <span className="font-semibold">Ghi chú: </span> {row.original.note || '(Không có)'}
                        </p>
                    </div>
                )
            }
        },
        {
            id: 'delivery',
            header: () => <div>Phương thức nhận hàng</div>,
            cell: ({ row }) => {
                const deliveryMethod = deliveryMethodTypes.find(type => type.value === !!row.original.recipientName)
                if (!deliveryMethod) return null

                return (
                    <div className="flex items-center">
                        {deliveryMethod.icon && <deliveryMethod.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                        <span>{deliveryMethod.label}</span>
                    </div>
                )
            }
        },
        {
            accessorKey: 'status',
            header: () => <div className="text-center">Trạng thái</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge
                        style={{
                            background: row.original.status.color
                        }}
                    >
                        <ClockArrowUp /> {row.original.status.name}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'createdBy',
            header: () => <div>Thông tin khách hàng</div>,
            cell: ({ row }) => (
                <div className="flex flex-col gap-2 break-words whitespace-normal">
                    <p>
                        <span className="font-semibold">Khách hàng: </span>
                        {row.original.customer?.name}
                    </p>
                    <p>
                        <span className="font-semibold">Ngày đặt hàng: </span>
                        {dayjs(row.original.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                    </p>
                </div>
            )
        },
        {
            id: 'lastUpdate',
            header: () => <div>Lần cập nhật cuối</div>,
            cell: ({ row }) => {
                const logs = row.original.statusUpdateLogs || []
                const lastLog = logs.length > 0 ? logs[logs.length - 1] : null

                if (!lastLog) {
                    return <div>Chưa có cập nhật</div>
                } else {
                    return (
                        <div className="flex flex-col gap-2 break-words whitespace-normal">
                            <p>
                                <span className="font-semibold">Nhân viên: </span>
                                {lastLog.updatedByStaff?.name}
                            </p>
                            <p>
                                <span className="font-semibold">Thời gian: </span>
                                {dayjs(lastLog?.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
                            </p>
                        </div>
                    )
                }
            }
        },
        {
            id: 'actions',
            header: () => <div className="text-center">Hành động</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                                <MoreHorizontal />
                                <span className="sr-only">Mở menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-[160px]">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewOrder(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <PDFDownloadLink
                                    key={row.original.orderId}
                                    document={<InvoicePDF order={row.original} />}
                                    fileName={`SS_hoa_don ${row.original.orderId}.pdf`}
                                >
                                    In hóa đơn
                                </PDFDownloadLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={!hasProcessPermission}
                                className="cursor-pointer"
                                onClick={() => onProcessOrder(row.original)}
                            >
                                Xử lý đơn hàng
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ]

    const lastPage = Math.ceil(total / limit)

    return (
        <div className="flex flex-col gap-8">
            <OrderTableToolbar
                limit={limit}
                setLimit={setLimit}
                getCsvOrdersQuery={getCsvOrdersQuery}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
                orderStatuses={orderStatuses}
            />
            <DataTable columns={columns} data={orders} />
            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default OrderTable
