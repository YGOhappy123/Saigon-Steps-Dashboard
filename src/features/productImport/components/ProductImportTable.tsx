import { UseQueryResult } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { ScanBarcode, MoreHorizontal, BadgeDollarSign, Package } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ImportSortAndFilterParams } from '@/features/productImport/services/importService'
import ProductImportTableToolbar from '@/features/productImport/components/ProductImportTableToolbar'
import Pagination from '@/components/common/Pagination'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type ProductImportTableProps = {
    imports: IProductImport[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    buildQuery: (params: ImportSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
    onViewImport: (value: IProductImport) => void
    getCsvImportsQuery: UseQueryResult<any, any>
}

const ProductImportTable = ({
    imports,
    total,
    page,
    limit,
    setPage,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    hasAddPermission,
    onViewImport,
    getCsvImportsQuery
}: ProductImportTableProps) => {
    const columns: ColumnDef<IProductImport>[] = [
        {
            accessorKey: 'importId',
            header: () => <div>Mã đơn nhập hàng</div>,
            cell: ({ row }) => <div>{row.original.importId}</div>
        },
        {
            accessorKey: 'invoiceNumber',
            header: () => <div className="text-center">Mã hóa đơn</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge variant="secondary" className="bg-pink-500 text-white dark:bg-pink-600">
                        <Package /> {row.original.invoiceNumber}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'importDate',
            header: () => <div>Ngày nhập hàng</div>,
            cell: ({ row }) => <div>{dayjs(row.original.importDate).format('DD/MM/YYYY HH:mm:ss')}</div>
        },
        {
            id: 'Tổng số sản phẩm',
            accessorFn: row => {
                return (row.importItems ?? [{ stock: 0 }]).reduce((total, item) => total + (item.quantity ?? 0), 0)
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
            accessorKey: 'totalCost',
            header: () => <div className="text-center">Tổng chi phí</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge variant="success">
                        <BadgeDollarSign /> {formatCurrency(row.original.totalCost)}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'trackedBy',
            header: () => <div>Thông tin người ghi nhận</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-2 break-words whitespace-normal">
                        <p>
                            <span className="font-semibold">Người ghi nhận: </span>
                            {(row.original.trackedByStaff as Partial<IStaff> | undefined)?.name}
                        </p>
                        <p>
                            <span className="font-semibold">Ngày ghi nhận: </span>
                            {dayjs(row.original.trackedAt).format('DD/MM/YYYY HH:mm:ss')}
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewImport(row.original)}>
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
            <ProductImportTableToolbar
                getCsvImportsQuery={getCsvImportsQuery}
                limit={limit}
                setLimit={setLimit}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
                hasAddPermission={hasAddPermission}
            />
            <DataTable columns={columns} data={imports} />
            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default ProductImportTable
