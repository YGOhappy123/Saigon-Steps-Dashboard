import { useSelector } from 'react-redux'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Printer } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RootState } from '@/store'
import { ReportData } from '@/features/statistic/pages/KeyCustomerStatisticPage'
import { Button } from '@/components/ui/button'
import HighestOrderCountTable from '@/features/statistic/components/HighestOrderCountTable'
import HighestOrderAmountTable from '@/features/statistic/components/HighestOrderAmountTable'
import KeyCustomersReportPDF from '@/features/statistic/components/KeyCustomersReportPDF'
import dayjs from '@/libs/dayjs'

type KeyCustomersProps = {
    limit: string
    reportData: ReportData
}

const KeyCustomers = ({ limit, reportData }: KeyCustomersProps) => {
    const user = useSelector((state: RootState) => state.auth.user)

    return (
        <Card className="col-span-6">
            <CardHeader className="flex items-center justify-between gap-12">
                <div className="flex flex-col justify-center gap-1">
                    <CardTitle className="text-xl">Khách hàng nổi bật</CardTitle>
                    <CardDescription>
                        Hiển thị danh sách khách hàng nổi bật từ{' '}
                        {dayjs(reportData.range.from).format('HH:mm ngày DD/MM/YYYY')} đến{' '}
                        {dayjs(reportData.range.to).format('HH:mm ngày DD/MM/YYYY')}.
                    </CardDescription>
                </div>
                <PDFDownloadLink
                    document={<KeyCustomersReportPDF reportData={reportData} user={user!} limit={limit} />}
                    fileName={`SS_thong_ke_khach_hang_noi_bat ${dayjs(reportData.range.from).format('DD-MM-YYYY')} ${dayjs(reportData.range.to).format('DD-MM-YYYY')}.pdf`}
                >
                    <Button>
                        <Printer />
                        <span className="hidden xl:inline">In báo cáo</span>
                    </Button>
                </PDFDownloadLink>
            </CardHeader>
            <Separator />

            <CardContent>
                <div className="flex flex-col gap-6">
                    <HighestOrderCountTable limit={limit} customers={reportData.highestOrderCountCustomers ?? []} />
                    <HighestOrderAmountTable limit={limit} customers={reportData.highestSpendingCustomers ?? []} />
                </div>
            </CardContent>
        </Card>
    )
}

export default KeyCustomers
