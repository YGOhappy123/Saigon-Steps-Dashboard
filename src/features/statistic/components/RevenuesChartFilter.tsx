import { FormEvent, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { DateRange } from 'react-day-picker'
import { FileChartColumn } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ReportData } from '@/features/statistic/pages/RevenueStatisticPage'
import DateRangePicker from '@/components/common/DateRangePicker'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'
import dayjs from '@/libs/dayjs'

type RevenuesChartFilterProps = {
    onSuccess: (data: ReportData) => void
}

const RevenuesChartFilter = ({ onSuccess }: RevenuesChartFilterProps) => {
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

    const getRevenuesChartQuery = useQuery({
        queryKey: ['revenues-chart-statistic'],
        queryFn: () =>
            axios.get<IResponseData<ReportData>>(
                `/statistics/revenues?from=${dayjs(range![0]).format('YYYY-MM-DD')}&to=${dayjs(range![1]).format('YYYY-MM-DD')}`
            ),
        enabled: range !== undefined && range.length === 2,
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        if (getRevenuesChartQuery.isSuccess && getRevenuesChartQuery.data) {
            onSuccess(getRevenuesChartQuery.data.data?.data)
        }
    }, [getRevenuesChartQuery.isSuccess, getRevenuesChartQuery.data])

    const handleReport = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)

        if (getRevenuesChartQuery.isLoading) return
        if (range!.length === 0) {
            return toast('Vui lòng chọn ngày bắt đầu và ngày kết thúc', toastConfig('info'))
        }
        if (range!.length === 1) {
            return toast('Vui lòng chọn ngày kết thúc', toastConfig('info'))
        }
        if (date!.to! > tomorrow) {
            return toast('Ngày kết thúc phải bé hơn hoặc bằng hôm nay', toastConfig('info'))
        }

        getRevenuesChartQuery.refetch()
    }

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Tạo báo cáo doanh thu</CardTitle>
                <CardDescription>
                    Xem báo cáo về doanh thu, chi phí nhập hàng, chi phí thiệt hại,... theo khoảng thời gian
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-4" onSubmit={handleReport}>
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
                    <Separator />
                    <div className="flex justify-end gap-2">
                        <Button disabled={getRevenuesChartQuery.isLoading}>
                            <FileChartColumn /> Xem báo cáo
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default RevenuesChartFilter
