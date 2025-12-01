import { UseQueryResult } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { ScanBarcode, Footprints, MoreHorizontal, Wallet, BadgeDollarSign, ClipboardType } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DamageSortAndFilterParams } from '@/features/damageReport/services/damageService'
import { INVENTORY_DAMAGE_REASON_MAP } from '@/configs/constants'
import DamageReportTableToolbar from '@/features/damageReport/components/DamageReportTableToolbar'
import Pagination from '@/components/common/Pagination'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type DamageReportTableProps = {
    damages: IInventoryDamageReport[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    buildQuery: (params: DamageSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
    onViewDamage: (value: IInventoryDamageReport) => void
    getCsvDamagesQuery: UseQueryResult<any, any>
}

export const damageReportTypes = [
    {
        value: false,
        label: 'Giày / dép',
        icon: Footprints
    },
    {
        value: true,
        label: 'Phụ kiện',
        icon: Wallet
    }
]

const DamageReportTable = ({
    damages,
    total,
    page,
    limit,
    setPage,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    hasAddPermission,
    onViewDamage,
    getCsvDamagesQuery
}: DamageReportTableProps) => {
    const columns: ColumnDef<IInventoryDamageReport>[] = [
        {
            accessorKey: 'reportId',
            header: () => <div>Mã báo cáo</div>,
            cell: ({ row }) => <div>{row.original.reportId}</div>
        },
        {
            accessorKey: 'reason',
            header: () => <div>Nguyên nhân thiệt hại</div>,
            cell: ({ row }) => (
                <div className="flex max-w-[400px] flex-col gap-2 break-words whitespace-normal">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Phân loại: </span>
                        <Badge variant="secondary" className="bg-pink-500 text-white dark:bg-pink-600">
                            <ClipboardType /> {INVENTORY_DAMAGE_REASON_MAP[row.original.reason]}
                        </Badge>
                    </div>
                    <p>
                        <span className="font-semibold">Ghi chú: </span>
                        {row.original.note ?? '(Không có)'}
                    </p>
                </div>
            )
        },
        {
            id: 'Tổng số sản phẩm',
            accessorFn: row => {
                return (row.reportItems ?? [{ stock: 0 }]).reduce((total, item) => total + (item.quantity ?? 0), 0)
            },
            header: () => <div className="text-center">Tổng số sản phẩm</div>,
            cell: ({ getValue }) => {
                const totalStock = getValue<number>()

                return (
                    <div className="flex justify-center">
                        <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
                            <ScanBarcode /> {totalStock.toString().padStart(2, '0')}
                        </Badge>
                    </div>
                )
            }
        },
        {
            accessorKey: 'totalExpectedCost',
            header: () => <div className="text-center">Tổng thiệt hại ước tính</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge variant="success">
                        <BadgeDollarSign /> {formatCurrency(row.original.totalExpectedCost)}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'reportedBy',
            header: () => <div>Thông tin người tạo báo cáo</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-2 break-words whitespace-normal">
                        <p>
                            <span className="font-semibold">Người tạo: </span>
                            {(row.original.reportedByStaff as Partial<IStaff> | undefined)?.name}
                        </p>
                        <p>
                            <span className="font-semibold">Ngày tạo: </span>
                            {dayjs(row.original.reportedAt).format('DD/MM/YYYY HH:mm:ss')}
                        </p>
                    </div>
                )
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewDamage(row.original)}>
                                Chi tiết
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
            <DamageReportTableToolbar
                getCsvDamagesQuery={getCsvDamagesQuery}
                limit={limit}
                setLimit={setLimit}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
                hasAddPermission={hasAddPermission}
            />
            <DataTable columns={columns} data={damages} />
            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default DamageReportTable
