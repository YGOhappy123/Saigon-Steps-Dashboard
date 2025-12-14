import { useSelector } from 'react-redux'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RootState } from '@/store'
import { ReportData } from '@/features/statistic/pages/ProductStatisticPage'
import PageLimitSelect from '@/components/common/PageLimitSelect'
import ProductsSalesReportPDF from '@/features/statistic/components/ProductsSalesReportPDF'

import dayjs from '@/libs/dayjs'

type ProductSalesTableToolbarProps = {
    limit: number
    setLimit: (limit: number) => void
    reportData: ReportData
    hasActivity: boolean
}

const ProductSalesTableToolbar = ({ limit, setLimit, reportData, hasActivity }: ProductSalesTableToolbarProps) => {
    const user = useSelector((state: RootState) => state.auth.user)

    return (
        <div className="flex items-center justify-between">
            <PageLimitSelect limit={limit} setLimit={setLimit} />

            <div className="flex justify-center gap-2">
                <PDFDownloadLink
                    document={<ProductsSalesReportPDF reportData={reportData} user={user!} hasActivity={hasActivity} />}
                    fileName={`SS_thong_ke_doanh_so_san_pham ${dayjs(reportData.range.from).format('DD-MM-YYYY')} ${dayjs(reportData.range.to).format('DD-MM-YYYY')}.pdf`}
                >
                    <Button>
                        <Printer />
                        <span className="hidden xl:inline">In báo cáo</span>
                    </Button>
                </PDFDownloadLink>
            </div>
        </div>
    )
}

export default ProductSalesTableToolbar
