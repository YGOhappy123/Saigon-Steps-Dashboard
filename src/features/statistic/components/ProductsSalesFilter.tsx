import { FormEvent, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { DateRange } from 'react-day-picker'
import { Expand, FileChartColumn, Shrink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ReportData } from '@/features/statistic/pages/ProductStatisticPage'
import DateRangePicker from '@/components/common/DateRangePicker'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'
import dayjs from '@/libs/dayjs'

type ProductsSalesFilterProps = {
    hasActivity: boolean
    setHasActivity: (hasActivity: boolean) => void
    onSuccess: (data: ReportData) => void
}

const ProductsSalesFilter = ({ hasActivity, setHasActivity, onSuccess }: ProductsSalesFilterProps) => {
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

    const getProductsSalesQuery = useQuery({
        queryKey: ['products-sales-statistic'],
        queryFn: () =>
            axios.get<IResponseData<ReportData>>(
                `/statistics/products?hasActivity=${hasActivity}&from=${dayjs(range![0]).format('YYYY-MM-DD')}&to=${dayjs(range![1]).format('YYYY-MM-DD')}`
            ),
        enabled: range !== undefined && range.length === 2,
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        if (getProductsSalesQuery.isSuccess && getProductsSalesQuery.data) {
            onSuccess(getProductsSalesQuery.data.data?.data)
        }
    }, [getProductsSalesQuery.isSuccess, getProductsSalesQuery.data])

    const handleReport = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)

        if (getProductsSalesQuery.isLoading) return
        if (range!.length === 0) {
            return toast('Vui lòng chọn ngày bắt đầu và ngày kết thúc', toastConfig('info'))
        }
        if (range!.length === 1) {
            return toast('Vui lòng chọn ngày kết thúc', toastConfig('info'))
        }
        if (date!.to! > tomorrow) {
            return toast('Ngày kết thúc phải bé hơn hoặc bằng hôm nay', toastConfig('info'))
        }

        getProductsSalesQuery.refetch()
    }

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Tạo báo cáo sản phẩm</CardTitle>
                <CardDescription>
                    Xem báo cáo về số lượng, doanh thu, hoàn trả,... của sản phẩm theo khoảng thời gian
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-4" onSubmit={handleReport}>
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 xl:gap-4">
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Thời gian cần khảo sát</h4>
                            <DateRangePicker
                                date={date}
                                setDate={setDate}
                                placeHolder="Thời gian cần khảo sát..."
                                triggerClassName="text-card-foreground h-10 text-sm"
                                disableFutureDates
                            />
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Tùy chọn hiển thị</h4>
                            <Select
                                value={hasActivity.toString()}
                                onValueChange={value => setHasActivity(value === 'true' ? true : false)}
                            >
                                <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[
                                        {
                                            value: 'true',
                                            label: 'Hiển thị các sản phẩm có phát sinh giao dịch',
                                            Icon: Shrink
                                        },
                                        {
                                            value: 'false',
                                            label: 'Hiển thị tất cả sản phẩm trên hệ thống',
                                            Icon: Expand
                                        }
                                    ].map(sortOption => (
                                        <SelectItem key={sortOption.value} value={sortOption.value}>
                                            <sortOption.Icon /> {sortOption.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex justify-end gap-2">
                        <Button disabled={getProductsSalesQuery.isLoading}>
                            <FileChartColumn /> Xem báo cáo
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default ProductsSalesFilter
