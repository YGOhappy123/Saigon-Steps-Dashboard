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
import { RoleSortAndFilterParams } from '@/features/personnel/services/roleService'
import { Button } from '@/components/ui/button'
import RoleTableToolbar from '@/features/personnel/components/RoleTableToolbar'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import Pagination from '@/components/common/Pagination'

type RoleTableProps = {
    roles: IStaffRole[]
    permissions: IPermission[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    buildQuery: (params: RoleSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
    hasUpdatePermission: boolean
    hasDeletePermission: boolean
    onViewRole: (value: IStaffRole) => void
    onUpdateRole: (value: IStaffRole) => void
    getCsvRolesQuery: UseQueryResult<any, any>
    addNewRoleMutation: UseMutationResult<any, any, Partial<IStaffRole>, any>
    removeRoleMutation: UseMutationResult<any, any, number, any>
}

export const roleTypes = [
    {
        value: false,
        label: 'Có thể chỉnh sửa',
        icon: CircleCheck
    },
    {
        value: true,
        label: 'Không thể chỉnh sửa',
        icon: CircleX
    }
]

const RoleTable = ({
    roles,
    permissions,
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
    onViewRole,
    onUpdateRole,
    getCsvRolesQuery,
    addNewRoleMutation,
    removeRoleMutation
}: RoleTableProps) => {
    const columns: ColumnDef<IStaffRole>[] = [
        {
            accessorKey: 'roleId',
            header: () => <div className="text-center">Mã vai trò</div>,
            cell: ({ row }) => <div>{row.original.roleId}</div>
        },
        {
            accessorKey: 'name',
            header: () => <div>Tên vai trò</div>,
            cell: ({ row }) => <div>{row.original.name}</div>
        },
        {
            accessorKey: 'isImmutable',
            header: () => <div>Loại vai trò</div>,
            cell: ({ row }) => {
                const roleType = roleTypes.find(type => type.value === row.original.isImmutable)
                if (!roleType) return null

                return (
                    <div className="flex items-center">
                        {roleType.icon && <roleType.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                        <span>{roleType.label}</span>
                    </div>
                )
            }
        },
        {
            accessorKey: 'permissions',
            header: () => <div>Danh sách quyền truy cập</div>,
            cell: ({ row }) => {
                const permissions = (row.original.permissions ?? []) as IPermission[]

                return (
                    <div className="flex flex-col items-start space-y-2">
                        {permissions
                            .filter(permission => permission.code.startsWith('ACCESS'))
                            .map((permission, index) => (
                                <span key={index}>{permission.name}</span>
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewRole(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={row.original.isImmutable || !hasUpdatePermission}
                                className="cursor-pointer"
                                onClick={() => {
                                    if (!row.original.isImmutable && hasUpdatePermission) {
                                        onUpdateRole(row.original)
                                    }
                                }}
                            >
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmationDialog
                                title="Bạn có chắc muốn xóa vai trò này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn vai trò khỏi hệ thống Saigon Steps."
                                onConfirm={async () => {
                                    if (!row.original.isImmutable && hasDeletePermission) {
                                        removeRoleMutation.mutateAsync(row.original.roleId)
                                    }
                                }}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={row.original.isImmutable || !hasDeletePermission}
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
            <RoleTableToolbar
                getCsvRolesQuery={getCsvRolesQuery}
                limit={limit}
                setLimit={setLimit}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
                permissions={permissions}
                hasAddPermission={hasAddPermission}
                addNewRoleMutation={addNewRoleMutation}
            />
            <DataTable columns={columns} data={roles} />
            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default RoleTable
