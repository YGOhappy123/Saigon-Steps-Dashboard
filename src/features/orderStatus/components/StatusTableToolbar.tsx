import { useState } from 'react'
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { FileSpreadsheet, Funnel } from 'lucide-react'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { exportToCSV } from '@/utils/exportCsvFile'
import { StatusSortAndFilterParams } from '@/features/orderStatus/services/statusService'
import PageLimitSelect from '@/components/common/PageLimitSelect'
import StatusFilter from '@/features/orderStatus/components/StatusFilter'
import AddStatusDialog from '@/features/orderStatus/components/AddStatusDialog'
import dayjs from '@/libs/dayjs'

type StatusTableToolbarProps = {
    limit: number
    setLimit: (limit: number) => void
    getCsvStatusesQuery: UseQueryResult<any, any>
    buildQuery: (params: StatusSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
    addNewStatusMutation: UseMutationResult<any, any, Partial<IOrderStatus>, any>
    statusActions: {
        name: string
        label: string
        shorten: string
    }[]
}

const StatusTableToolbar = ({
    getCsvStatusesQuery,
    limit,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    hasAddPermission,
    addNewStatusMutation,
    statusActions
}: StatusTableToolbarProps) => {
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        getCsvStatusesQuery.refetch().then(res => {
            const csvStatuses = res.data?.data?.data ?? []
            const formattedStatuses = csvStatuses.map((status: IOrderStatus) => ({
                ['Mã trạng thái']: status.statusId,
                ['Tên trạng thái']: status.name,
                ['Mô tả']: status.description,
                ['Loại trạng thái']: status.isDefault ? 'Trạng thái mặc định' : 'Trạng thái thông thường'
            }))

            exportToCSV(
                formattedStatuses,
                `SS_danh_sach_trang_thai ${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`,
                [{ wch: 15 }, { wch: 30 }, { wch: 80 }, { wch: 20 }]
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
                            Lọc trạng thái
                            {havingFilters && (
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <StatusFilter
                        setHavingFilters={setHavingFilters}
                        onChange={buildQuery}
                        onSearch={onFilterSearch}
                        onReset={onResetFilterSearch}
                        statusActions={statusActions}
                    />
                </Popover>

                {hasAddPermission && (
                    <AddStatusDialog statusActions={statusActions} addNewStatusMutation={addNewStatusMutation} />
                )}

                <Button onClick={exportCsvFile}>
                    <FileSpreadsheet /> Xuất file CSV
                </Button>
            </div>
        </div>
    )
}

export default StatusTableToolbar
