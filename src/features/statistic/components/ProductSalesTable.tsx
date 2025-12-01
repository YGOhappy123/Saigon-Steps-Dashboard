import { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { BadgeDollarSign, Crown, MoreHorizontal, ScanBarcode } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ReportData } from '@/features/statistic/pages/ProductStatisticPage'
import formatCurrency from '@/utils/formatCurrency'
import Pagination from '@/components/common/Pagination'
import ProductSalesTableToolbar from '@/features/statistic/components/ProductSalesTableToolbar'

type ProductSalesTableProps = {
    reportData: ReportData
    hasActivity: boolean
}

const ProductSalesTable = ({ reportData, hasActivity }: ProductSalesTableProps) => {
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState(10)
    const lastPage = Math.ceil(reportData.sales.length / limit)
    const paginatedSales = reportData.sales.slice((page - 1) * limit, page * limit)

    useEffect(() => {
        setPage(1)
    }, [reportData.sales, limit])

    const columns: ColumnDef<ReportData['sales'][number]>[] = [
        {
            accessorKey: 'rootProductId',
            header: () => <div>Mã sản phẩm</div>,
            cell: ({ row }) => <div>{row.original.rootProductId}</div>
        },
        {
            accessorKey: 'rootProduct',
            header: () => <div>Thông tin sản phẩm</div>,
            cell: ({ row }) => {
                const rootProduct = row.original.rootProduct

                return (
                    <div className="flex max-w-[500px] items-start gap-2">
                        <div className="border-primary flex w-[70px] shrink-0 items-center justify-center overflow-hidden rounded-xl border-3 p-1">
                            <img
                                src={rootProduct.images?.[0] as string}
                                alt="product image"
                                className="aspect-square h-full w-full rounded-lg object-cover"
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-2 break-words whitespace-normal">
                            <p>
                                <span className="font-semibold">Tên: </span>
                                {rootProduct.name}
                            </p>
                            {rootProduct?.category && (
                                <p>
                                    <span className="font-semibold">Danh mục: </span>
                                    {(rootProduct.category as IShoeCategory)?.name}
                                </p>
                            )}
                            {rootProduct.brand && (
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Thương hiệu: </span>
                                    <Badge variant="default">
                                        <Crown /> {(rootProduct.brand as IProductBrand)?.name}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        },
        {
            id: 'soldData',
            header: () => <div>Số liệu bán ra</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Số lượng bán ra: </span>
                            <Badge variant="success">
                                <ScanBarcode /> {row.original.sales.totalSoldUnits.toString().padStart(2, '0')}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Doanh thu: </span>
                            <Badge variant="success">
                                <BadgeDollarSign /> {formatCurrency(row.original.sales.totalSales)}
                            </Badge>
                        </div>
                    </div>
                )
            }
        },
        {
            id: 'refundedData',
            header: () => <div>Số liệu hoàn trả</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Số lượng hoàn trả: </span>
                            <Badge variant="destructive">
                                <ScanBarcode /> {row.original.sales.totalRefundedUnits.toString().padStart(2, '0')}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Số tiền hoàn trả: </span>
                            <Badge variant="destructive">
                                <BadgeDollarSign /> {formatCurrency(row.original.sales.totalRefundedAmount)}
                            </Badge>
                        </div>
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
                            <DropdownMenuItem className="cursor-pointer">
                                <a
                                    href={`/san-pham/${row.original.rootProduct.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Chi tiết
                                </a>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ]

    return (
        <div className="flex flex-col gap-8">
            <ProductSalesTableToolbar
                limit={limit}
                setLimit={setLimit}
                reportData={reportData}
                hasActivity={hasActivity}
            />
            <DataTable columns={columns} data={paginatedSales} />
            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default ProductSalesTable
