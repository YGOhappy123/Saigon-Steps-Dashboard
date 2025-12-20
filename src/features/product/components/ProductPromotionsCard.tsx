import { ColumnDef } from '@tanstack/react-table'
import { BadgeAlert, BadgeCheck } from 'lucide-react'
import { sections } from '@/features/product/components/TableOfContents'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import dayjs from '@/libs/dayjs'

type ProductPromotionsCardProps = {
    product: IRootProduct
}

const ProductPromotionsCard = ({ product }: ProductPromotionsCardProps) => {
    const section = sections.promotions
    const columns: ColumnDef<Partial<IPromotion>>[] = [
        {
            accessorKey: 'name',
            header: () => <div>Khuyến mãi</div>,
            cell: ({ row }) => (
                <p className="break-words whitespace-normal">
                    {row.original.promotionId} - {row.original.name} - {row.original.discountRate}%
                </p>
            )
        },
        {
            id: 'applyTime',
            header: 'Thời gian áp dụng',
            cell: ({ row }) => (
                <div className="flex flex-col gap-2">
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
        },
        {
            id: 'priority',
            header: () => <div className="text-center">Ưu tiên áp dụng</div>,
            cell: ({ row }) => {
                const isTopPriority = row.index === 0

                return (
                    <div className="flex justify-center">
                        {isTopPriority ? (
                            <Badge variant="default">
                                <BadgeCheck /> Ưu tiên
                            </Badge>
                        ) : (
                            <Badge variant="destructive">
                                <BadgeAlert /> Không
                            </Badge>
                        )}
                    </div>
                )
            }
        }
    ]

    return (
        <Card className="w-full max-w-4xl" id={section.id}>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <CardDescription>
                    Thông tin về các chương trình khuyến mãi đang áp dụng cho sản phẩm này.
                    <br />
                    (Không bao gồm các khuyến mãi đã bị khóa).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable data={product.promotions ?? []} columns={columns} />
            </CardContent>
        </Card>
    )
}

export default ProductPromotionsCard
