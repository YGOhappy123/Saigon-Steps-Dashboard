import { ColumnDef } from '@tanstack/react-table'
import { BadgeAlert, BadgeCheck, BadgeDollarSign } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import dayjs from '@/libs/dayjs'

type HighestOrderCountTableProps = {
    customers: (ICustomer & { orderCount: number })[]
}

const HighestOrderCountTable = ({ customers }: HighestOrderCountTableProps) => {
    const columns: ColumnDef<ICustomer & { orderCount: number }>[] = [
        {
            accessorKey: 'customerId',
            header: () => <div>Mã khách hàng</div>,
            cell: ({ row }) => row.original.customerId
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
            id: 'customerData',
            header: () => <div>Thông tin khách hàng</div>,
            cell: ({ row }) => (
                <div>
                    <p className="text-base font-medium break-words whitespace-normal">{row.original.name}</p>
                    <p className="text-muted-foreground break-words whitespace-normal">
                        <span className="font-medium">Email: </span>
                        {row.original.email ?? 'Chưa cập nhật'}
                    </p>
                </div>
            )
        },
        {
            accessorKey: 'createdAt',
            header: () => <div>Thời gian đăng ký</div>,
            cell: ({ row }) => (
                <div className="w-[150px]">{dayjs(row.original.createdAt).format('DD/MM/YYYY HH:mm:ss')}</div>
            )
        },
        {
            accessorKey: 'orderCount',
            header: () => <div className="text-center">Tổng số đơn hàng</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
                        <BadgeDollarSign /> {row.original.orderCount.toString().padStart(2, '0')}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'isActive',
            header: () => <div className="text-center">Trạng thái</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    {row.original.isActive ? (
                        <Badge variant="default">
                            <BadgeCheck /> Còn hoạt động
                        </Badge>
                    ) : (
                        <Badge variant="destructive">
                            <BadgeAlert /> Đã khóa tài khoản
                        </Badge>
                    )}
                </div>
            )
        }
    ]

    return (
        <div>
            <div className="mb-4 flex flex-col items-center gap-1.5">
                <h4 className="text-xl font-semibold">Top 5 khách hàng có số lượng đơn đặt hàng cao nhẩt</h4>
                <span className="text-muted-foreground text-sm">Có bao gồm các đơn hàng chưa xử lý hoặc thất bại.</span>
            </div>

            <DataTable columns={columns} data={customers} />
        </div>
    )
}

export default HighestOrderCountTable
