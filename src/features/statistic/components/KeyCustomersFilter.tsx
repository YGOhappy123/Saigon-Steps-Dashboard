import { FormEvent, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { DateRange } from 'react-day-picker'
import { FileChartColumn } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ReportData } from '@/features/statistic/pages/KeyCustomerStatisticPage'
import DateRangePicker from '@/components/common/DateRangePicker'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'
import dayjs from '@/libs/dayjs'

type KeyCustomersFilterProps = {
    limit: string
    setLimit: (limit: string) => void
    onSuccess: (data: ReportData) => void
}

const KeyCustomersFilter = ({ limit, setLimit, onSuccess }: KeyCustomersFilterProps) => {
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

    const getKeyCustomersQuery = useQuery({
        queryKey: ['key-customers-statistic'],
        queryFn: () =>
            axios.get<IResponseData<ReportData>>(
                `/statistics/key-customers?limit=${limit}&from=${dayjs(range![0]).format('YYYY-MM-DD')}&to=${dayjs(range![1]).format('YYYY-MM-DD')}`
            ),
        enabled: range !== undefined && range.length === 2 && Number(limit) >= 1,
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        if (getKeyCustomersQuery.isSuccess && getKeyCustomersQuery.data) {
            onSuccess(getKeyCustomersQuery.data.data?.data)
        }
    }, [getKeyCustomersQuery.isSuccess, getKeyCustomersQuery.data])

    const handleReport = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)

        if (getKeyCustomersQuery.isLoading) return
        if (range!.length === 0) {
            return toast('Vui lòng chọn ngày bắt đầu và ngày kết thúc', toastConfig('info'))
        }
        if (range!.length === 1) {
            return toast('Vui lòng chọn ngày kết thúc', toastConfig('info'))
        }
        if (date!.to! > tomorrow) {
            return toast('Ngày kết thúc phải bé hơn hoặc bằng hôm nay', toastConfig('info'))
        }
        if (Number(limit) < 1) {
            return toast('Số lượng khách hàng khảo sát phải lớn hơn hoặc bằng 1', toastConfig('info'))
        }

        getKeyCustomersQuery.refetch()
    }

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Tạo báo cáo khách hàng nổi bật</CardTitle>
                <CardDescription>
                    Xem báo cáo về các khách hàng có hoạt động nổi bật theo khoảng thời gian
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
                            <h4 className="text-sm font-medium">Số lượng cần khảo sát</h4>
                            <Input
                                name="limit"
                                placeholder="Số lượng cần khảo sát..."
                                className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                                type="number"
                                value={limit}
                                onChange={e => setLimit(Number(e.target.value) > 1 ? e.target.value : '1')}
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className="flex justify-end gap-2">
                        <Button disabled={getKeyCustomersQuery.isLoading}>
                            <FileChartColumn /> Xem báo cáo
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default KeyCustomersFilter
