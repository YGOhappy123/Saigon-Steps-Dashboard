import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UseQueryResult } from '@tanstack/react-query'
import { FileSpreadsheet, Funnel, PencilLine } from 'lucide-react'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { exportToCSV } from '@/utils/exportCsvFile'
import { DamageSortAndFilterParams } from '@/features/damageReport/services/damageService'
import { INVENTORY_DAMAGE_REASON_MAP } from '@/configs/constants'
import PageLimitSelect from '@/components/common/PageLimitSelect'
import DamageReportFilter from '@/features/damageReport/components/DamageReportFilter'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type DamageReportTableToolbarProps = {
    limit: number
    setLimit: (limit: number) => void
    getCsvDamagesQuery: UseQueryResult<any, any>
    buildQuery: (params: DamageSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
}

const DamageReportTableToolbar = ({
    getCsvDamagesQuery,
    limit,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    hasAddPermission
}: DamageReportTableToolbarProps) => {
    const navigate = useNavigate()
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        getCsvDamagesQuery.refetch().then(res => {
            const csvImports = res.data?.data?.data ?? []
            const formattedImports = csvImports.map((damageReport: IInventoryDamageReport) => ({
                ['Mã báo cáo thiệt hại']: damageReport.reportId,
                ['Phân loại thiệt hại']: INVENTORY_DAMAGE_REASON_MAP[damageReport.reason],
                ['Tổng thiệt hại ước tính (VNĐ)']: formatCurrency(damageReport.totalExpectedCost),
                ['Ghi chú']: damageReport.note || '(Không có)',
                ['Người tạo báo cáo']: damageReport.reportedByStaff?.name,
                ['Thời gian tạo báo cáo']: dayjs(damageReport.reportedAt).format('DD/MM/YYYY HH:mm:ss')
            }))

            exportToCSV(
                formattedImports,
                `SS_danh_sach_bao_cao_thiet_hai ${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`,
                [{ wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 60 }, { wch: 30 }, { wch: 30 }]
            )
        })
    }

    return (
        <div className="flex items-center justify-between">
            <PageLimitSelect limit={limit} setLimit={setLimit} />

            <div className="flex justify-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="relative">
                            <Funnel />
                            Lọc báo cáo thiệt hại
                            {havingFilters && (
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <DamageReportFilter
                        setHavingFilters={setHavingFilters}
                        onChange={buildQuery}
                        onSearch={onFilterSearch}
                        onReset={onResetFilterSearch}
                    />
                </Popover>

                {hasAddPermission && (
                    <Button variant="lighter" onClick={() => navigate('/bao-cao-thiet-hai/them')}>
                        <PencilLine />
                        Tạo báo cáo
                    </Button>
                )}

                <Button onClick={exportCsvFile}>
                    <FileSpreadsheet /> Xuất file CSV
                </Button>
            </div>
        </div>
    )
}

export default DamageReportTableToolbar
