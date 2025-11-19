import { useState } from 'react'
import { UseQueryResult } from '@tanstack/react-query'
import { FileSpreadsheet, Funnel } from 'lucide-react'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { exportToCSV } from '@/utils/exportCsvFile'
import { UpdateLogsSortAndFilterParams } from '@/features/inventory/services/inventoryService'
import { INVENTORY_UPDATE_TYPE_MAP } from '@/configs/constants'
import PageLimitSelect from '@/components/common/PageLimitSelect'
import InventoryUpdateLogFilter from '@/features/inventory/components/InventoryUpdateLogFilter'
import dayjs from '@/libs/dayjs'

type InventoryUpdateLogTableToolbarProps = {
    limit: number
    setLimit: (limit: number) => void
    getCsvUpdateLogsQuery: UseQueryResult<any, any>
    buildQuery: (params: UpdateLogsSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
}

const InventoryUpdateLogTableToolbar = ({
    limit,
    setLimit,
    getCsvUpdateLogsQuery,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch
}: InventoryUpdateLogTableToolbarProps) => {
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        getCsvUpdateLogsQuery.refetch().then(res => {
            const csvLogs = res.data?.data?.data ?? []
            const formattedLogs = csvLogs.map((log: IInventoryUpdateLog) => ({
                ['Mã log']: log.logId,
                ['Phân loại log']: INVENTORY_UPDATE_TYPE_MAP[log.type as InventoryUpdateType],
                ['Tên sản phẩm']: log.productItem?.rootProduct?.name,
                ['Phân loại sản phẩm']: log.productItem?.size,
                ['Số lượng thay đổi']: log.quantity.toString().padStart(2, '0') + ' sản phẩm',
                ['Nguồn phát sinh']: log.order
                    ? `Đơn hàng #${log.order.orderId}`
                    : log.import
                      ? `Đơn nhập hàng #${log.import.importId}`
                      : `Báo cáo thiệt hại #${log.damageReport?.reportId}`,
                ['Thời gian ghi nhận']: dayjs(log.updatedAt).format('DD/MM/YYYY HH:mm:ss')
            }))

            exportToCSV(formattedLogs, `SS_danh_sach_cap_nhat_kho ${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`, [
                { wch: 15 },
                { wch: 30 },
                { wch: 60 },
                { wch: 20 },
                { wch: 20 },
                { wch: 30 },
                { wch: 30 }
            ])
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
                            Lọc lịch sử xuất nhập kho
                            {havingFilters && (
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <InventoryUpdateLogFilter
                        setHavingFilters={setHavingFilters}
                        onChange={buildQuery}
                        onSearch={onFilterSearch}
                        onReset={onResetFilterSearch}
                    />
                </Popover>

                <Button onClick={exportCsvFile}>
                    <FileSpreadsheet /> Xuất file CSV
                </Button>
            </div>
        </div>
    )
}

export default InventoryUpdateLogTableToolbar
