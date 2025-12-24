import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { CircleCheck, CircleX, DollarSign, MoreHorizontal, Percent, TicketCheck } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { COUPON_TYPE_MAP } from '@/configs/constants'
import { CouponSortAndFilterParams } from '@/features/promotion/services/couponService'
import CouponTableToolbar from '@/features/promotion/components/CouponTableToolbar'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import Pagination from '@/components/common/Pagination'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

const couponTypes = [
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

type CouponTableProps = {
    coupons: ICoupon[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    buildQuery: (params: CouponSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
    hasDisablePermission: boolean
    onViewCoupon: (value: ICoupon) => void
    getCsvCouponsQuery: UseQueryResult<any, any>
    addNewCouponMutation: UseMutationResult<any, any, Partial<ICoupon>, any>
    disableCouponMutation: UseMutationResult<any, any, number, any>
}

const CouponTable = ({
    coupons,
    total,
    page,
    limit,
    setPage,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    hasAddPermission,
    hasDisablePermission,
    onViewCoupon,
    getCsvCouponsQuery,
    addNewCouponMutation,
    disableCouponMutation
}: CouponTableProps) => {
    const columns: ColumnDef<ICoupon>[] = [
        {
            accessorKey: 'couponId',
            header: () => <div className="text-center">Mã phiếu</div>,
            cell: ({ row }) => <div>{row.original.couponId}</div>
        },
        {
            accessorKey: 'code',
            header: () => <div className="text-center">Mã code</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <Badge variant="success">
                            <TicketCheck /> {row.original.code}
                        </Badge>
                    </div>
                )
            }
        },
        {
            accessorKey: 'expiredAt',
            header: () => <div>Thông tin chi tiết</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-2 break-words whitespace-normal">
                        <p>
                            <span className="font-semibold">Loại giảm giá: </span>
                            {COUPON_TYPE_MAP[row.original.type]}
                        </p>
                        <p>
                            <span className="font-semibold">Lượt dùng tối đa: </span>
                            {row.original.maxUsage
                                ? row.original.maxUsage.toString().padStart(2, '0')
                                : '(Không giới hạn)'}
                        </p>
                        <p>
                            <span className="font-semibold">Ngày kết thúc: </span>
                            {row.original.expiredAt
                                ? dayjs(row.original.expiredAt).format('DD/MM/YYYY')
                                : '(Không giới hạn)'}
                        </p>
                    </div>
                )
            }
        },
        {
            accessorKey: 'amount',
            header: () => <div className="text-center">Giá trị giảm</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        {row.original.type === 'FIXED' ? (
                            <Badge variant="secondary" className="bg-pink-500 text-white dark:bg-pink-600">
                                <DollarSign /> {formatCurrency(row.original.amount)}
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
                                <Percent /> {row.original.amount.toString().padStart(2, '0')}%
                            </Badge>
                        )}
                    </div>
                )
            }
        },
        {
            accessorKey: 'isActive',
            header: () => <div>Trạng thái hiện tại</div>,
            cell: ({ row }) => {
                const couponType = couponTypes.find(type => type.value === row.original.isActive)
                if (!couponType) return null
                return (
                    <div className="flex items-center">
                        {couponType.icon && <couponType.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                        <span>{couponType.label}</span>
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewCoupon(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmationDialog
                                title="Bạn có chắc muốn khóa phiếu giảm giá này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ khóa phiếu giảm giá vĩnh viễn trong hệ thống Saigon Steps."
                                onConfirm={async () => {
                                    if (!row.original.isActive || !hasDisablePermission) return
                                    await disableCouponMutation.mutateAsync(row.original.couponId)
                                }}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={!row.original.isActive || !hasDisablePermission}
                                        className="cursor-pointer"
                                    >
                                        Khóa phiếu giảm giá
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
            <CouponTableToolbar
                getCsvCouponsQuery={getCsvCouponsQuery}
                limit={limit}
                setLimit={setLimit}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
                hasAddPermission={hasAddPermission}
                addNewCouponMutation={addNewCouponMutation}
            />
            <DataTable columns={columns} data={coupons} />
            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default CouponTable
