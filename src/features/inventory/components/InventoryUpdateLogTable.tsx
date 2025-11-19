import { useNavigate } from 'react-router-dom'
import { UseQueryResult } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { ScanBarcode, MoreHorizontal, Package, ClipboardType } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { INVENTORY_DAMAGE_REASON_MAP, INVENTORY_UPDATE_TYPE_MAP } from '@/configs/constants'
import { UpdateLogsSortAndFilterParams } from '@/features/inventory/services/inventoryService'
import InventoryUpdateLogTableToolbar from '@/features/inventory/components/InventoryUpdateLogTableToolbar'
import Pagination from '@/components/common/Pagination'
import dayjs from '@/libs/dayjs'

type InventoryUpdateLogTableProps = {
    updateLogs: IInventoryUpdateLog[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    buildQuery: (params: UpdateLogsSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    getCsvUpdateLogsQuery: UseQueryResult<any, any>
}

const InventoryUpdateLogTable = ({
    updateLogs,
    total,
    page,
    limit,
    setPage,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    getCsvUpdateLogsQuery
}: InventoryUpdateLogTableProps) => {
    const navigate = useNavigate()
    const columns: ColumnDef<IInventoryUpdateLog>[] = [
        {
            accessorKey: 'logId',
            header: () => <div>Mã log</div>,
            cell: ({ row }) => <div>{row.original.logId}</div>
        },
        {
            accessorKey: 'reason',
            header: () => <div className="text-center">Phân loại cập nhật</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge variant="secondary" className="bg-pink-500 text-white dark:bg-pink-600">
                        <ClipboardType /> {INVENTORY_UPDATE_TYPE_MAP[row.original.type]}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'productItem',
            header: () => <div>Thông tin sản phẩm</div>,
            cell: ({ row }) => {
                const productItem = row.original.productItem!

                return (
                    <div className="flex max-w-[480px] items-start gap-2">
                        <div className="border-primary flex w-[70px] items-center justify-center overflow-hidden rounded-xl border-3 p-1">
                            <img
                                src={productItem.rootProduct?.images?.[0] as string}
                                alt="product image"
                                className="aspect-square h-full w-full rounded-lg object-cover"
                            />
                        </div>
                        <div className="flex flex-col gap-2 break-words whitespace-normal">
                            <p>
                                <span className="font-semibold">Tên: </span>
                                {productItem.rootProduct?.name}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Phân loại: </span>
                                <Badge variant="default">
                                    <Package /> {productItem.size}
                                </Badge>
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'quantity',
            header: () => <div className="text-center">Số lượng</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
                        <ScanBarcode /> {row.original.quantity.toString().padStart(2, '0')}
                    </Badge>
                </div>
            )
        },
        {
            id: 'origin',
            header: () => <div>Nguồn phát sinh</div>,
            cell: ({ row }) => (
                <div className="flex flex-col gap-2">
                    {row.original.order && (
                        <>
                            <p>
                                <span className="font-semibold">Đơn hàng: </span>
                                {row.original.order.orderId}
                            </p>
                            <p>
                                <span className="font-semibold">Khách đặt: </span>
                                {row.original.order.customer?.name}
                            </p>
                            <p>
                                <span className="font-semibold">Đặt lúc: </span>
                                {dayjs(row.original.order.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                            </p>
                        </>
                    )}

                    {row.original.import && (
                        <>
                            <p>
                                <span className="font-semibold">Đơn nhập hàng: </span>
                                {row.original.import.importId}
                            </p>
                            <p>
                                <span className="font-semibold">Mã hóa đơn: </span>
                                {row.original.import.invoiceNumber}
                            </p>
                            <p>
                                <span className="font-semibold">Ghi nhận lúc: </span>
                                {dayjs(row.original.import.trackedAt).format('DD/MM/YYYY HH:mm:ss')}
                            </p>
                        </>
                    )}

                    {row.original.damageReport && (
                        <>
                            <p>
                                <span className="font-semibold">Báo cáo thiệt hại: </span>
                                {row.original.damageReport.reportId}
                            </p>
                            <p>
                                <span className="font-semibold">Lý do: </span>
                                {INVENTORY_DAMAGE_REASON_MAP[row.original.damageReport.reason as InventoryDamageReason]}
                            </p>
                            <p>
                                <span className="font-semibold">Ghi nhận lúc: </span>
                                {dayjs(row.original.damageReport.reportedAt).format('DD/MM/YYYY HH:mm:ss')}
                            </p>
                        </>
                    )}
                </div>
            )
        },
        {
            accessorKey: 'updatedAt',
            header: () => <div>Ngày ghi nhận</div>,
            cell: ({ row }) => <p>{dayjs(row.original.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</p>
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
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => navigate(`/san-pham/${row.original.productItem?.rootProduct?.slug}`)}
                            >
                                Chi tiết sản phẩm
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
            <InventoryUpdateLogTableToolbar
                getCsvUpdateLogsQuery={getCsvUpdateLogsQuery}
                limit={limit}
                setLimit={setLimit}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
            />
            <DataTable columns={columns} data={updateLogs} />
            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default InventoryUpdateLogTable
