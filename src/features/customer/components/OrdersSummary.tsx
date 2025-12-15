import { IconType } from '@icons-pack/react-simple-icons'
import { CircleDollarSign, ShoppingCart, Undo2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ReportData } from '@/features/customer/components/ViewOrdersStatisticDialog'

type OrdersSummaryProps = {
    countData: ReportData['count']
}

const OrdersSummary = ({ countData }: OrdersSummaryProps) => {
    return (
        <Card>
            <CardContent>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 text-justify">
                        <span className="font-medium">Đơn vừa tạo: </span>
                        <HighlightedContent
                            content={countData.placed.toString().padStart(2, '0')}
                            Icon={ShoppingCart}
                        />
                    </div>
                    <div className="flex items-center gap-3 text-justify">
                        <span className="font-medium">Đơn đã giao: </span>
                        <HighlightedContent
                            content={countData.accounted.toString().padStart(2, '0')}
                            Icon={CircleDollarSign}
                        />
                    </div>
                    <div className="flex items-center gap-3 text-justify">
                        <span className="font-medium">Đơn hoàn trả: </span>
                        <HighlightedContent content={countData.refunded.toString().padStart(2, '0')} Icon={Undo2} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

type HighlightedContentProps = {
    content: string
    Icon?: IconType
}

const HighlightedContent = ({ content, Icon }: HighlightedContentProps) => {
    return (
        <div className="text-success flex items-center gap-2 rounded bg-white px-2.5 py-0.5 text-base">
            {Icon && <Icon size={24} />}
            <span className="text-lg font-semibold">{content}</span>
        </div>
    )
}

export default OrdersSummary
