import { ColumnDef } from '@tanstack/react-table'
import { BadgeDollarSign } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import formatCurrency from '@/utils/formatCurrency'

type OrderCardItemTableProps = {
    orderItems: IOrder['orderItems']
}

const OrderCardItemTable = ({ orderItems }: OrderCardItemTableProps) => {
    const columns: ColumnDef<IOrder['orderItems'][number]>[] = [
        {
            id: 'product',
            header: () => <div>Sản phẩm</div>,
            cell: ({ row }) => {
                const productItem = row.original.productItem
                return (
                    <div className="flex items-start gap-2">
                        <div className="border-primary flex w-[70px] items-center justify-center overflow-hidden rounded-xl border-3 p-1">
                            <img
                                src={productItem?.rootProduct.images[0] as string}
                                alt="product image"
                                className="aspect-square h-full w-full rounded-lg object-cover"
                            />
                        </div>
                        <div className="flex flex-1 flex-col">
                            <a
                                className="line-clamp-1 text-base font-medium break-words whitespace-normal"
                                href={`/san-pham/${productItem?.rootProduct.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {productItem!.rootProduct.name}
                            </a>
                            <p className="text-muted-foreground break-words whitespace-normal">
                                <span className="font-medium">Kích thước: </span>
                                {productItem!.size}
                            </p>
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'quantity',
            header: () => <div className="text-center">Số lượng</div>,
            cell: ({ row }) => <div className="text-center">{row.original.quantity.toString().padStart(2, '0')}</div>
        },
        {
            accessorKey: 'price',
            header: () => <div className="text-center">Đơn giá</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge variant="success">
                        <BadgeDollarSign /> {formatCurrency(row.original.price)}
                    </Badge>
                </div>
            )
        }
    ]

    return <DataTable data={orderItems ?? []} columns={columns} />
}

export default OrderCardItemTable
