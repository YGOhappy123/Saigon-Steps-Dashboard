import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { CircleCheck, CircleX, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CustomerSortAndFilterParams } from '@/features/customer/services/customerService'
import { Button } from '@/components/ui/button'
import CustomerTableToolbar from '@/features/customer/components/CustomerTableToolbar'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import Pagination from '@/components/common/Pagination'
import dayjs from '@/libs/dayjs'

type CustomerTableProps = {
    customers: ICustomer[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    buildQuery: (params: CustomerSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasDeactivateCustomerPermission: boolean
    getCsvCustomersQuery: UseQueryResult<any, any>
    deactivateCustomerMutation: UseMutationResult<any, any, number, any>
}

const customerTypes = [
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

const CustomerTable = ({
    customers,
    total,
    page,
    limit,
    setPage,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    hasDeactivateCustomerPermission,
    getCsvCustomersQuery,
    deactivateCustomerMutation
}: CustomerTableProps) => {
    const columns: ColumnDef<ICustomer>[] = [
        {
            accessorKey: 'customerId',
            header: () => <div className="text-center">Mã khách hàng</div>,
            cell: ({ row }) => <div>{row.original.customerId}</div>
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
            header: () => <div>Họ và tên</div>,
            cell: ({ row }) => <div>{row.original.name}</div>
        },
        {
            accessorKey: 'email',
            header: () => <div>Email</div>,
            cell: ({ row }) => <div>{row.original.email ?? '(Chưa cập nhật)'}</div>
        },
        {
            accessorKey: 'createdAt',
            header: () => <div>Thời gian đăng ký</div>,
            cell: ({ row }) => <div>{dayjs(row.original.createdAt).format('DD/MM/YYYY HH:mm:ss')}</div>
        },
        {
            accessorKey: 'isActive',
            header: () => <div>Trạng thái</div>,
            cell: ({ row }) => {
                const customerType = customerTypes.find(type => type.value === row.original.isActive)
                if (!customerType) return null

                return (
                    <div className="flex w-[150px] items-center">
                        {customerType.icon && <customerType.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                        <span>{customerType.label}</span>
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
                            <ConfirmationDialog
                                title="Bạn có chắc muốn khóa tài khoản khách hàng này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ khóa tài khoản khách hàng vĩnh viễn trong hệ thống Saigon Steps."
                                onConfirm={async () => {
                                    if (hasDeactivateCustomerPermission && row.original.isActive) {
                                        deactivateCustomerMutation.mutateAsync(row.original.customerId)
                                    }
                                }}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={!hasDeactivateCustomerPermission || !row.original.isActive}
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
            <CustomerTableToolbar
                getCsvCustomersQuery={getCsvCustomersQuery}
                limit={limit}
                setLimit={setLimit}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
            />
            <DataTable columns={columns} data={customers} />
            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default CustomerTable
