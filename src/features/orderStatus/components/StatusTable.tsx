import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { CircleCheck, CircleX, ClockArrowUp, MoreHorizontal } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { StatusSortAndFilterParams } from '@/features/orderStatus/services/statusService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import StatusTableToolbar from '@/features/orderStatus/components/StatusTableToolbar'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import Pagination from '@/components/common/Pagination'

const statusTypes = [
    {
        value: true,
        label: 'Trạng thái mặc định',
        icon: CircleCheck
    },
    {
        value: false,
        label: 'Trạng thái thông thường',
        icon: CircleX
    }
]

type StatusTableProps = {
    statuses: IOrderStatus[]
    statusActions: {
        name: string
        shorten: string
        label: string
    }[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    buildQuery: (params: StatusSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
    hasUpdatePermission: boolean
    hasDeletePermission: boolean
    onViewStatus: (value: IOrderStatus) => void
    onUpdateStatus: (value: IOrderStatus) => void
    getCsvStatusesQuery: UseQueryResult<any, any>
    addNewStatusMutation: UseMutationResult<any, any, Partial<IOrderStatus>, any>
    deleteStatusMutation: UseMutationResult<any, any, number, any>
}

const StatusTable = ({
    statuses,
    statusActions,
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
    onViewStatus,
    onUpdateStatus,
    getCsvStatusesQuery,
    addNewStatusMutation,
    deleteStatusMutation
}: StatusTableProps) => {
    const columns: ColumnDef<IOrderStatus>[] = [
        {
            accessorKey: 'statusId',
            header: () => <div className="text-center">Mã trạng thái</div>,
            cell: ({ row }) => <div>{row.original.statusId}</div>
        },
        {
            accessorKey: 'name',
            header: () => <div className="text-center">Tên trạng thái</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge
                        style={{
                            background: row.original.color
                        }}
                    >
                        <ClockArrowUp /> {row.original.name}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'description',
            header: () => <div>Thông tin trạng thái</div>,
            cell: ({ row }) => (
                <div className="flex max-w-[350px] flex-col gap-2 break-words whitespace-normal">
                    <p className="line-clamp-3">
                        <span className="font-semibold">Mô tả: </span>
                        {row.original.description}
                    </p>
                    <p>
                        <span className="font-semibold">Yêu cầu giải thích: </span>
                        {row.original.isExplanationRequired ? 'Có' : 'Không'}
                    </p>
                    {row.original.explanationLabel && (
                        <p>
                            <span className="font-semibold">Mô tả yêu cầu: </span>
                            {row.original.explanationLabel}
                        </p>
                    )}
                </div>
            )
        },
        {
            accessorKey: 'isDefault',
            header: () => <div>Loại trạng thái</div>,
            cell: ({ row }) => {
                const statusType = statusTypes.find(type => type.value === row.original.isDefault)
                if (!statusType) return null

                return (
                    <div className="flex items-center">
                        {statusType.icon && <statusType.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                        <span>{statusType.label}</span>
                    </div>
                )
            }
        },
        {
            accessorKey: 'action',
            header: () => <div>Danh sách tác vụ</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col items-start space-y-2">
                        {statusActions
                            .filter(action => (row.original as any)[action.name])
                            .map(action => (
                                <span key={action.name}>{action.shorten}</span>
                            ))}
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewStatus(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={!hasUpdatePermission}
                                className="cursor-pointer"
                                onClick={() => {
                                    if (hasUpdatePermission) {
                                        onUpdateStatus(row.original)
                                    }
                                }}
                            >
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmationDialog
                                title="Bạn có chắc muốn xóa trạng thái này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn trạng thái khỏi hệ thống Saigon Steps."
                                onConfirm={async () => {
                                    if (!row.original.isDefault && hasDeletePermission) {
                                        deleteStatusMutation.mutateAsync(row.original.statusId)
                                    }
                                }}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={row.original.isDefault || !hasDeletePermission}
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
            <StatusTableToolbar
                getCsvStatusesQuery={getCsvStatusesQuery}
                limit={limit}
                setLimit={setLimit}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
                hasAddPermission={hasAddPermission}
                addNewStatusMutation={addNewStatusMutation}
                statusActions={statusActions}
            />
            <DataTable columns={columns} data={statuses} />
            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default StatusTable
