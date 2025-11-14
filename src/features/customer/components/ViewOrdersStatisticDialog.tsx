import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { IconType } from '@icons-pack/react-simple-icons'
import { CircleDollarSign, ShoppingCart, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { StatisticCriteria, statisticTypes } from '@/features/statistic/pages/RevenueStatisticPage'
import useAxiosIns from '@/hooks/useAxiosIns'
import OrdersChart from '@/features/customer/components/OrdersChart'

type ViewOrdersStatisticDialogProps = {
    customer: ICustomer | null
    open: boolean
    setOpen: (value: boolean) => void
}

const ViewOrdersStatisticDialog = ({ customer, open, setOpen }: ViewOrdersStatisticDialogProps) => {
    const axios = useAxiosIns()
    const [type, setType] = useState<StatisticCriteria>('daily')

    const getOrdersStatisticQuery = useQuery({
        queryKey: ['orders-statistic', type, customer?.customerId],
        queryFn: () => axios.get<IResponseData<any>>(`/statistics/orders/${customer?.customerId}?type=${type}`),
        enabled: open && customer !== null,
        refetchIntervalInBackground: true,
        refetchInterval: 20000,
        select: res => res.data
    })
    const statisticData = getOrdersStatisticQuery.data?.data

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl xl:min-w-4xl">
                <DialogHeader>
                    <DialogTitle>Thống kê đơn hàng của khách hàng</DialogTitle>
                    <DialogDescription>
                        Thông tin thống kê về đơn hàng của khách hàng theo các mốc thời gian khác nhau.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <div className="flex flex-col gap-4">
                    <Card>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <p className="flex items-center gap-3 text-justify">
                                    <span className="font-medium">Đơn vừa tạo: </span>
                                    <HighlightedContent
                                        content={(statisticData?.count?.placed ?? 0).toString().padStart(2, '0')}
                                        Icon={ShoppingCart}
                                    />
                                </p>
                                <p className="flex items-center gap-3 text-justify">
                                    <span className="font-medium">Đơn đã giao: </span>
                                    <HighlightedContent
                                        content={(statisticData?.count?.accounted ?? 0).toString().padStart(2, '0')}
                                        Icon={CircleDollarSign}
                                    />
                                </p>
                                <p className="flex items-center gap-3 text-justify">
                                    <span className="font-medium">Đơn hoàn trả: </span>
                                    <HighlightedContent
                                        content={(statisticData?.count?.refunded ?? 0).toString().padStart(2, '0')}
                                        Icon={Undo2}
                                    />
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <OrdersChart chartData={statisticData?.chart ?? []} />
                </div>
                <Separator />
                <DialogFooter className="w-full justify-between!">
                    <div className="flex items-center justify-center gap-2">
                        {statisticTypes.map(button => (
                            <Button
                                key={button.value}
                                variant={type === button.value ? 'default' : 'outline'}
                                onClick={() => setType(button.value as StatisticCriteria)}
                            >
                                {button.label}
                            </Button>
                        ))}
                    </div>
                    <DialogClose asChild>
                        <Button variant="outline">Đóng</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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

export default ViewOrdersStatisticDialog
