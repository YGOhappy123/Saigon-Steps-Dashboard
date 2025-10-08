import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { CircleCheck, CircleX, MoreHorizontal, TicketCheck } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PromotionSortAndFilterParams } from '@/features/promotion/services/promotionService'
import PromotionTableToolbar from '@/features/promotion/components/PromotionTableToolbar'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import Pagination from '@/components/common/Pagination'
import dayjs from '@/libs/dayjs'

type PromotionTableProps = {
    promotions: IPromotion[]
    products: IRootProduct[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    buildQuery: (params: PromotionSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
    hasUpdatePermission: boolean
    hasDisablePermission: boolean
    onViewPromotion: (value: IPromotion) => void
    onUpdatePromotion: (value: IPromotion) => void
    getCsvPromotionsQuery: UseQueryResult<any, any>
    addNewPromotionMutation: UseMutationResult<any, any, Partial<IPromotion>, any>
    disablePromotionMutation: UseMutationResult<any, any, number, any>
}

export const promotionTypes = [
    {
        value: false,
        label: 'Đã bị khóa',
        icon: CircleX
    },
    {
        value: true,
        label: 'Chưa bị khóa',
        icon: CircleCheck
    }
]

const PromotionTable = ({
    promotions,
    products,
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
    hasDisablePermission,
    onViewPromotion,
    onUpdatePromotion,
    getCsvPromotionsQuery,
    addNewPromotionMutation,
    disablePromotionMutation
}: PromotionTableProps) => {
    const columns: ColumnDef<IPromotion>[] = [
        {
            accessorKey: 'promotionId',
            header: () => <div className="text-center">Mã khuyến mãi</div>,
            cell: ({ row }) => <div>{row.original.promotionId}</div>
        },
        {
            accessorKey: 'name',
            header: () => <div>Thông tin khuyến mãi</div>,
            cell: ({ row }) => (
                <div className="flex max-w-[400px] flex-col gap-2 break-words whitespace-normal">
                    <p>
                        <span className="font-semibold">Tên: </span>
                        {row.original.name}
                    </p>
                    <p className="line-clamp-3">
                        <span className="font-semibold">Mô tả: </span>
                        {row.original.description}
                    </p>
                </div>
            )
        },
        {
            accessorKey: 'discountRate',
            header: () => <div className="text-center">Giá trị giảm</div>,
            cell: ({ getValue }) => {
                const totalStock = getValue<number>()
                return (
                    <div className="flex justify-center">
                        <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
                            <TicketCheck /> {totalStock.toString().padStart(2, '0')}%
                        </Badge>
                    </div>
                )
            }
        },
        {
            accessorKey: 'startDate',
            header: () => <div>Thời gian áp dụng</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-2 break-words whitespace-normal">
                        <p>
                            <span className="font-semibold">Bắt đầu: </span>
                            {dayjs(row.original.startDate).format('DD/MM/YYYY')}
                        </p>
                        <p>
                            <span className="font-semibold">Kết thúc: </span>
                            {dayjs(row.original.endDate).format('DD/MM/YYYY')}
                        </p>
                    </div>
                )
            }
        },
        {
            accessorKey: 'isActive',
            header: () => <div>Trạng thái hiện tại</div>,
            cell: ({ row }) => {
                const promotionType = promotionTypes.find(type => type.value === row.original.isActive)
                if (!promotionType) return null
                return (
                    <div className="flex items-center">
                        {promotionType.icon && <promotionType.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                        <span>{promotionType.label}</span>
                    </div>
                )
            }
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewPromotion(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={!hasUpdatePermission || !row.original.isActive}
                                className="cursor-pointer"
                                onClick={() => {
                                    if (!hasUpdatePermission || !row.original.isActive) return

                                    onUpdatePromotion(row.original)
                                }}
                            >
                                Chỉnh sửa thông tin
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmationDialog
                                title="Bạn có chắc muốn khóa chương trình khuyến mãi này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ khóa chương trình khuyến mãi vĩnh viễn trong hệ thống Saigon Steps."
                                onConfirm={async () => {
                                    if (!row.original.isActive || !hasDisablePermission) return

                                    await disablePromotionMutation.mutateAsync(row.original.promotionId)
                                }}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={!row.original.isActive || !hasDisablePermission}
                                        className="cursor-pointer"
                                    >
                                        Khóa khuyến mãi
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
            <PromotionTableToolbar
                getCsvPromotionsQuery={getCsvPromotionsQuery}
                limit={limit}
                setLimit={setLimit}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
                products={products}
                hasAddPermission={hasAddPermission}
                addNewPromotionMutation={addNewPromotionMutation}
            />
            <DataTable columns={columns} data={promotions} />
            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default PromotionTable
