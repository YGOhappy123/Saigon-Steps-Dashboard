import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { MoreHorizontal } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { BrandSortAndFilterParams } from '@/features/brand/services/brandService'
import { Button } from '@/components/ui/button'
import striptags from 'striptags'
import BrandTableToolbar from '@/features/brand/components/BrandTableToolbar'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import Pagination from '@/components/common/Pagination'

type BrandTableProps = {
    brands: IProductBrand[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    buildQuery: (params: BrandSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
    hasUpdatePermission: boolean
    hasDeletePermission: boolean
    onViewBrand: (value: IProductBrand) => void
    onUpdateBrand: (value: IProductBrand) => void
    getCsvBrandsQuery: UseQueryResult<any, any>
    addNewBrandMutation: UseMutationResult<any, any, Partial<IProductBrand>, any>
    deleteBrandMutation: UseMutationResult<any, any, number, any>
}

const BrandTable = ({
    brands,
    total,
    page,
    limit,
    setPage,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    hasAddPermission,
    hasUpdatePermission,
    hasDeletePermission,
    onViewBrand,
    onUpdateBrand,
    getCsvBrandsQuery,
    addNewBrandMutation,
    deleteBrandMutation
}: BrandTableProps) => {
    const columns: ColumnDef<IProductBrand>[] = [
        {
            accessorKey: 'brandId',
            header: () => <div className="text-center">Mã thương hiệu</div>,
            cell: ({ row }) => <div>{row.original.brandId}</div>
        },
        {
            accessorKey: 'avatar',
            header: () => <div>Ảnh logo</div>,
            cell: ({ row }) =>
                row.original.logoUrl ? (
                    <div className="border-primary flex w-[70px] items-center justify-center overflow-hidden rounded-xl border-3 p-1">
                        <img
                            src={row.original.logoUrl}
                            alt="product image"
                            className="aspect-square h-full w-full rounded-lg bg-white object-cover"
                        />
                    </div>
                ) : (
                    <div>(Chưa cập nhật)</div>
                )
        },
        {
            accessorKey: 'name',
            header: () => <div>Tên thương hiệu</div>,
            cell: ({ row }) => <div>{row.original.name}</div>
        },
        {
            accessorKey: 'description',
            header: () => <div>Mô tả</div>,
            cell: ({ row }) => (
                <div className="max-w-[600px] text-justify break-words whitespace-normal">
                    {striptags(row.original.description)}
                </div>
            )
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewBrand(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={!hasUpdatePermission}
                                className="cursor-pointer"
                                onClick={() => {
                                    if (hasUpdatePermission) {
                                        onUpdateBrand(row.original)
                                    }
                                }}
                            >
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmationDialog
                                title="Bạn có chắc muốn xóa thương hiệu này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn thương hiệu khỏi hệ thốngSaigon Steps."
                                onConfirm={async () => {
                                    if (hasDeletePermission) {
                                        deleteBrandMutation.mutateAsync(row.original.brandId)
                                    }
                                }}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={!hasDeletePermission}
                                        className="cursor-pointer"
                                    >
                                        Xóa
                                    </DropdownMenuItem>
                                }
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ]

    const lastPage = Math.ceil(total / limit)

    return (
        <div className="flex flex-col gap-8">
            <BrandTableToolbar
                getCsvBrandsQuery={getCsvBrandsQuery}
                limit={limit}
                setLimit={setLimit}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
                hasAddPermission={hasAddPermission}
                addNewBrandMutation={addNewBrandMutation}
            />
            <DataTable columns={columns} data={brands} />
            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default BrandTable
