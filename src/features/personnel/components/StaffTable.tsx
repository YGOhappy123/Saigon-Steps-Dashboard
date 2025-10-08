import { useSelector } from 'react-redux'
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { CircleCheck, CircleX, MoreHorizontal } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { StaffSortAndFilterParams } from '@/features/personnel/services/staffService'
import { Button } from '@/components/ui/button'
import { RootState } from '@/store'
import StaffTableToolbar from '@/features/personnel/components/StaffTableToolbar'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import Pagination from '@/components/common/Pagination'
import dayjs from '@/libs/dayjs'

type StaffTableProps = {
    staffs: IStaff[]
    roles: IStaffRole[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    buildQuery: (params: StaffSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
    hasUpdateInfoPermission: boolean
    hasChangeRolePermission: boolean
    hasDeactivateAccountPermission: boolean
    onViewStaff: (value: IStaff) => void
    onUpdateStaffInfo: (value: IStaff) => void
    onChangeStaffRole: (value: IStaff) => void
    getCsvStaffsQuery: UseQueryResult<any, any>
    addNewStaffMutation: UseMutationResult<any, any, Partial<IStaff>, any>
    deactivateStaffAccountMutation: UseMutationResult<any, any, number, any>
}

export const staffTypes = [
    {
        value: false,
        label: 'Đã bị khóa',
        icon: CircleX
    },
    {
        value: true,
        label: 'Đang hoạt động',
        icon: CircleCheck
    }
]

const StaffTable = ({
    staffs,
    roles,
    total,
    page,
    limit,
    setPage,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    hasAddPermission,
    hasUpdateInfoPermission,
    hasChangeRolePermission,
    hasDeactivateAccountPermission,
    onViewStaff,
    onUpdateStaffInfo,
    onChangeStaffRole,
    getCsvStaffsQuery,
    addNewStaffMutation,
    deactivateStaffAccountMutation
}: StaffTableProps) => {
    const user = useSelector((state: RootState) => state.auth.user)
    const columns: ColumnDef<IStaff>[] = [
        {
            accessorKey: 'staffId',
            header: () => <div className="text-center">Mã nhân viên</div>,
            cell: ({ row }) => <div>{row.original.staffId}</div>
        },
        {
            accessorKey: 'avatar',
            header: () => <div>Ảnh đại diện</div>,
            cell: ({ row }) => (
                <div className="border-primary flex w-[70px] items-center justify-center overflow-hidden rounded-full border-3 p-1">
                    <img
                        src={row.original.avatar}
                        alt="product image"
                        className="aspect-square h-full w-full rounded-full object-cover"
                    />
                </div>
            )
        },
        {
            accessorKey: 'name',
            header: () => <div>Thông tin nhân viên</div>,
            cell: ({ row }) => (
                <div className="flex flex-col gap-2 break-words whitespace-normal">
                    <p>
                        <span className="font-semibold">Họ và tên: </span>
                        {row.original.name}
                    </p>
                    <p>
                        <span className="font-semibold">Email: </span>
                        {row.original.email}
                    </p>
                </div>
            )
        },
        {
            accessorKey: 'role',
            header: () => <div>Vai trò</div>,
            cell: ({ row }) => <div>{(row.original.role as IStaffRole).name}</div>
        },
        {
            accessorKey: 'isActive',
            header: () => <div>Trạng thái</div>,
            cell: ({ row }) => {
                const staffType = staffTypes.find(type => type.value === row.original.isActive)
                if (!staffType) return null

                return (
                    <div className="flex items-center">
                        {staffType.icon && <staffType.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                        <span>{staffType.label}</span>
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
                            {(row.original.createdByStaff as Partial<IStaff> | undefined)?.name ?? '(Không có)'}
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewStaff(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={
                                    (row.original.role as Partial<IStaffRole>).isImmutable ||
                                    !hasChangeRolePermission ||
                                    !row.original.isActive
                                }
                                className="cursor-pointer"
                                onClick={() => {
                                    if (
                                        (row.original.role as Partial<IStaffRole>).isImmutable ||
                                        !hasChangeRolePermission ||
                                        !row.original.isActive
                                    )
                                        return

                                    onChangeStaffRole(row.original)
                                }}
                            >
                                Thay đổi vai trò
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={
                                    (row.original.role as Partial<IStaffRole>).isImmutable ||
                                    !hasUpdateInfoPermission ||
                                    !row.original.isActive
                                }
                                className="cursor-pointer"
                                onClick={() => {
                                    if (
                                        (row.original.role as Partial<IStaffRole>).isImmutable ||
                                        !hasUpdateInfoPermission ||
                                        !row.original.isActive
                                    )
                                        return

                                    onUpdateStaffInfo(row.original)
                                }}
                            >
                                Chỉnh sửa thông tin
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmationDialog
                                title="Bạn có chắc muốn khóa tài khoản nhân viên này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ khóa tài khoản nhân viên vĩnh viễn trong hệ thống Saigon Steps."
                                onConfirm={async () => {
                                    if (
                                        (row.original.role as Partial<IStaffRole>).isImmutable ||
                                        row.original.staffId === user?.staffId ||
                                        !row.original.isActive ||
                                        !hasDeactivateAccountPermission
                                    )
                                        return

                                    await deactivateStaffAccountMutation.mutateAsync(row.original.staffId)
                                }}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={
                                            (row.original.role as Partial<IStaffRole>).isImmutable ||
                                            row.original.staffId === user?.staffId ||
                                            !row.original.isActive ||
                                            !hasDeactivateAccountPermission
                                        }
                                        className="cursor-pointer"
                                    >
                                        Khóa tài khoản
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
            <StaffTableToolbar
                getCsvStaffsQuery={getCsvStaffsQuery}
                limit={limit}
                setLimit={setLimit}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
                roles={roles}
                hasAddPermission={hasAddPermission}
                addNewStaffMutation={addNewStaffMutation}
            />
            <DataTable columns={columns} data={staffs} />
            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default StaffTable
