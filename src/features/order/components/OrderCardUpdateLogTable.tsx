import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import dayjs from '@/libs/dayjs'

type OrderCardUpdateLogTableProps = {
    statusUpdateLogs: IOrder['statusUpdateLogs']
}

const OrderCardUpdateLogTable = ({ statusUpdateLogs }: OrderCardUpdateLogTableProps) => {
    const columns: ColumnDef<IOrder['statusUpdateLogs'][number]>[] = [
        {
            id: 'updatedBy',
            header: () => <div>Nhân viên thực hiện</div>,
            cell: ({ row }) => (
                <div className="flex items-start gap-2">
                    <div className="border-primary flex w-[70px] items-center justify-center overflow-hidden rounded-full border-3 p-1">
                        <img
                            src={row.original.updatedByStaff?.avatar as string}
                            alt="product image"
                            className="aspect-square h-full w-full rounded-full object-cover"
                        />
                    </div>
                    <div className="flex flex-1 flex-col">
                        <p className="text-base font-medium break-words whitespace-normal">
                            {row.original.updatedByStaff?.name}
                        </p>
                        <p className="text-muted-foreground break-words whitespace-normal">
                            <span className="font-medium">Mã nhân viên: </span>
                            {row.original.updatedBy}
                        </p>
                        <p className="text-muted-foreground break-words whitespace-normal">
                            <span className="font-medium">Email: </span>
                            {row.original.updatedByStaff?.email}
                        </p>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'updatedAt',
            header: () => <div>Thời gian cập nhật</div>,
            cell: ({ row }) => <p>{dayjs(row.original.updatedAt).format('HH:mm:ss - DD/MM/YYYY')}</p>
        },
        {
            accessorKey: 'status',
            header: () => <div className="text-center">Trạng thái mới</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge
                        style={{
                            background: row.original.status.color
                        }}
                    >
                        {row.original.status.name}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'explanation',
            header: () => <div>Ghi chú/ giải thích</div>,
            cell: ({ row }) => {
                const explanation = row.original.explanation
                return (
                    <p className="max-w-[180px] break-words whitespace-normal">
                        {explanation ? `${row.original.status.explanationLabel}: ${explanation}` : '(Không có)'}
                    </p>
                )
            }
        }
    ]

    return <DataTable data={statusUpdateLogs ?? []} columns={columns} />
}

export default OrderCardUpdateLogTable
