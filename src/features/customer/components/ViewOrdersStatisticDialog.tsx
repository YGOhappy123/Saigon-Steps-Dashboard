import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { DateRange } from 'react-day-picker'
import { Printer } from 'lucide-react'
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
import { RootState } from '@/store'
import useAxiosIns from '@/hooks/useAxiosIns'
import OrdersSummary from '@/features/customer/components/OrdersSummary'
import OrdersChart from '@/features/customer/components/OrdersChart'
import DateRangePicker from '@/components/common/DateRangePicker'
import CustomerOrdersReportPDF from '@/features/customer/components/CustomerOrdersReportPDF'
import dayjs from '@/libs/dayjs'
import slugify from 'slugify'

type ViewOrdersStatisticDialogProps = {
    customer: ICustomer | null
    open: boolean
    setOpen: (value: boolean) => void
}

export type ReportData = {
    range: {
        from: Date
        to: Date
    }
    count: {
        placed: number
        accounted: number
        refunded: number
    }
    chart: {
        name: string
        totalRefunds: number
        totalSales: number
    }[]
}

const ViewOrdersStatisticDialog = ({ customer, open, setOpen }: ViewOrdersStatisticDialogProps) => {
    const user = useSelector((state: RootState) => state.auth.user)
    const axios = useAxiosIns()
    const [range, setRange] = useState<string[] | any[]>()
    const [date, setDate] = useState<DateRange | undefined>({ from: new Date(), to: new Date() })

    useEffect(() => {
        if (date) {
            const dateRange = [date.from]
            if (date.to) dateRange.push(date.to)

            setRange(dateRange)
        } else {
            setRange([])
        }
    }, [date])

    const getOrdersStatisticQuery = useQuery({
        queryKey: ['orders-statistic', customer?.customerId, range],
        queryFn: () =>
            axios.get<IResponseData<ReportData>>(
                `/statistics/orders/${customer?.customerId}?from=${dayjs(range![0]).format('YYYY-MM-DD')}&to=${dayjs(range![1]).format('YYYY-MM-DD')}`
            ),
        enabled: open && customer !== null && range !== undefined && range.length === 2,
        refetchOnWindowFocus: false,
        select: res => res.data
    })
    const statisticData = getOrdersStatisticQuery.data?.data ?? {
        range: { from: '', to: '' },
        count: { placed: 0, accounted: 0, refunded: 0 },
        chart: []
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl xl:min-w-4xl">
                <DialogHeader>
                    <DialogTitle>Thống kê đơn hàng của khách hàng</DialogTitle>
                    <DialogDescription>
                        Thông tin thống kê về đơn hàng của khách hàng theo khoảng thời gian.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <div className="flex flex-col gap-4">
                    <OrdersSummary countData={statisticData.count} />
                    <OrdersChart chartData={statisticData.chart} />
                </div>
                <Separator />
                <DialogFooter className="w-full items-center! justify-between!">
                    <DateRangePicker
                        date={date}
                        setDate={setDate}
                        placeHolder="Thời gian cần khảo sát..."
                        triggerClassName="text-card-foreground h-10 text-sm"
                        disableFutureDates
                    />
                    <div className="flex items-center justify-center gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Đóng</Button>
                        </DialogClose>
                        {open && customer != null && (
                            <PDFDownloadLink
                                key={`${customer.customerId}-${statisticData.range.from}-${statisticData.range.to}`}
                                document={
                                    <CustomerOrdersReportPDF
                                        reportData={statisticData as ReportData}
                                        user={user!}
                                        customer={customer}
                                    />
                                }
                                fileName={`SS_thong_ke_don_hang ${slugify(customer.name, {
                                    replacement: '_',
                                    locale: 'vi'
                                })} ${dayjs(statisticData.range.from).format('DD-MM-YYYY')} ${dayjs(statisticData.range.to).format('DD-MM-YYYY')}.pdf`}
                            >
                                <Button>
                                    <Printer />
                                    <span>In báo cáo</span>
                                </Button>
                            </PDFDownloadLink>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ViewOrdersStatisticDialog
