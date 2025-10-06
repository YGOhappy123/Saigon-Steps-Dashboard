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
import { CategorySortAndFilterParams } from '@/features/category/services/categoryService'
import { Button } from '@/components/ui/button'
import CategoryTableToolbar from '@/features/category/components/CategoryTableToolbar'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import Pagination from '@/components/common/Pagination'
import dayjs from '@/libs/dayjs'

type CategoryTableProps = {
    categories: IShoeCategory[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    buildQuery: (params: CategorySortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
    hasUpdatePermission: boolean
    hasDeletePermission: boolean
    onViewCategory: (value: IShoeCategory) => void
    onUpdateCategory: (value: IShoeCategory) => void
    getCsvCategoriesQuery: UseQueryResult<any, any>
    addNewCategoryMutation: UseMutationResult<any, any, Partial<IShoeCategory>, any>
    deleteCategoryMutation: UseMutationResult<any, any, number, any>
}

const CategoryTable = ({
    categories,
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
    onViewCategory,
    onUpdateCategory,
    getCsvCategoriesQuery,
    addNewCategoryMutation,
    deleteCategoryMutation
}: CategoryTableProps) => {
    const columns: ColumnDef<IShoeCategory>[] = [
        {
            accessorKey: 'categoryId',
            header: () => <div className="text-center">Mã danh mục</div>,
            cell: ({ row }) => <div>{row.original.categoryId}</div>
        },
        {
            accessorKey: 'name',
            header: () => <div>Tên danh mục</div>,
            cell: ({ row }) => <div>{row.original.name}</div>
        },
        {
            accessorKey: 'createdBy',
            header: () => <div>Thông tin người tạo</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-2 break-words whitespace-normal">
                        <p>
                            <span className="font-semibold">Người tạo: </span>
                            {(row.original.createdByStaff as Partial<IStaff> | undefined)?.name}
                        </p>
                        <p>
                            <span className="font-semibold">Ngày tạo: </span>
                            {dayjs(row.original.createdAt).format('DD/MM/YYYY HH:mm:ss')}
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewCategory(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={!hasUpdatePermission}
                                className="cursor-pointer"
                                onClick={() => {
                                    if (hasUpdatePermission) {
                                        onUpdateCategory(row.original)
                                    }
                                }}
                            >
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmationDialog
                                title="Bạn có chắc muốn xóa danh mục này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn danh mục khỏi hệ thốngSaigon Steps."
                                onConfirm={async () => {
                                    if (hasDeletePermission) {
                                        deleteCategoryMutation.mutateAsync(row.original.categoryId)
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
            <CategoryTableToolbar
                getCsvCategoriesQuery={getCsvCategoriesQuery}
                limit={limit}
                setLimit={setLimit}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
                hasAddPermission={hasAddPermission}
                addNewCategoryMutation={addNewCategoryMutation}
            />
            <DataTable columns={columns} data={categories} />
            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default CategoryTable
