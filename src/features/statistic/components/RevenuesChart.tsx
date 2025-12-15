import { useState } from 'react'
import { useSelector } from 'react-redux'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Printer } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ReportData } from '@/features/statistic/pages/RevenueStatisticPage'
import { RootState } from '@/store'
import RevenuesReportPDF from '@/features/statistic/components/RevenuesReportPDF'
import RevenuesChartBody from '@/features/statistic/components/RevenuesChartBody'
import dayjs from '@/libs/dayjs'

type RevenuesChartProps = {
    reportData: ReportData
}

const RevenuesChart = ({ reportData }: RevenuesChartProps) => {
    const user = useSelector((state: RootState) => state.auth.user)

    const [visibleBars, setVisibleBars] = useState({
        totalSales: true,
        totalImports: true,
        totalDamages: true,
        totalRefunds: true,
        revenue: true
    })

    const toggleBar = (key: keyof typeof visibleBars) => {
        setVisibleBars(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <Card className="col-span-6">
            <CardHeader className="flex items-center justify-between gap-12">
                <div className="flex flex-col justify-center gap-1">
                    <CardTitle className="text-xl">Biểu đồ doanh thu</CardTitle>
                    <CardDescription>
                        Hiển thị doanh thu của cửa hàng từ{' '}
                        {dayjs(reportData.range.from).format('HH:mm ngày DD/MM/YYYY')} đến{' '}
                        {dayjs(reportData.range.to).format('HH:mm ngày DD/MM/YYYY')}.
                    </CardDescription>
                </div>
                <PDFDownloadLink
                    document={<RevenuesReportPDF reportData={reportData} user={user!} />}
                    fileName={`SS_thong_ke_doanh_thu ${dayjs(reportData.range.from).format('DD-MM-YYYY')} ${dayjs(reportData.range.to).format('DD-MM-YYYY')}.pdf`}
                >
                    <Button>
                        <Printer />
                        <span className="hidden xl:inline">In báo cáo</span>
                    </Button>
                </PDFDownloadLink>
            </CardHeader>
            <Separator />

            <div className="flex flex-wrap items-center gap-4 px-6">
                <span className="font-medium">Hiển thị: </span>
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={visibleBars.totalSales}
                        onCheckedChange={() => toggleBar('totalSales')}
                        id="toggle-sales"
                    />
                    <Label htmlFor="toggle-sales">Tiền từ đơn hàng</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={visibleBars.totalImports}
                        onCheckedChange={() => toggleBar('totalImports')}
                        id="toggle-imports"
                    />
                    <Label htmlFor="toggle-imports">Chi phí nhập hàng</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={visibleBars.totalDamages}
                        onCheckedChange={() => toggleBar('totalDamages')}
                        id="toggle-damages"
                    />
                    <Label htmlFor="toggle-damages">Thiệt hại sản phẩm</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={visibleBars.totalRefunds}
                        onCheckedChange={() => toggleBar('totalRefunds')}
                        id="toggle-refunds"
                    />
                    <Label htmlFor="toggle-refunds">Số tiền hoàn trả</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={visibleBars.revenue}
                        onCheckedChange={() => toggleBar('revenue')}
                        id="toggle-revenue"
                    />
                    <Label htmlFor="toggle-revenue">Doanh thu</Label>
                </div>
            </div>

            <CardContent>
                {reportData.chart.length === 0 && <Skeleton className="h-[200px] w-full" />}

                {reportData.chart.length > 0 && (
                    <RevenuesChartBody chartData={reportData.chart} visibleBars={visibleBars} />
                )}
            </CardContent>
        </Card>
    )
}

export default RevenuesChart
