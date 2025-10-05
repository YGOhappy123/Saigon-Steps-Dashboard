import { useState } from 'react'
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { FileSpreadsheet, Funnel } from 'lucide-react'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { exportToCSV } from '@/utils/exportCsvFile'
import { StaffSortAndFilterParams } from '@/features/personnel/services/staffService'
import PageLimitSelect from '@/components/common/PageLimitSelect'
import StaffFilter from '@/features/personnel/components/StaffFilter'
import AddStaffDialog from '@/features/personnel/components/AddStaffDialog'
import dayjs from '@/libs/dayjs'

type StaffTableToolbarProps = {
    limit: number
    setLimit: (limit: number) => void
    getCsvStaffsQuery: UseQueryResult<any, any>
    buildQuery: (params: StaffSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    roles: IStaffRole[]
    hasAddPermission: boolean
    addNewStaffMutation: UseMutationResult<any, any, Partial<IStaff>, any>
}

const StaffTableToolbar = ({
    getCsvStaffsQuery,
    limit,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    roles,
    hasAddPermission,
    addNewStaffMutation
}: StaffTableToolbarProps) => {
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        getCsvStaffsQuery.refetch().then(res => {
            const csvStaffs = res.data?.data?.data ?? []
            const formattedStaffs = csvStaffs.map((staff: IStaff) => ({
                ['Mã nhân viên']: staff.staffId,
                ['Họ và tên']: staff.name,
                ['Email']: staff.email ?? '(Chưa cập nhật)',
                ['Vai trò']: (staff.role as IStaffRole).name,
                ['Người tạo']: (staff.createdByStaff as IStaff | null)?.name ?? '(Không có)',
                ['Thời gian tạo']: dayjs(staff.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                ['Trạng thái']: staff.isActive ? 'Đang hoạt động' : 'Đã bị khóa'
            }))

            exportToCSV(formattedStaffs, `SS_danh_sach_nhan_vien ${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`, [
                { wch: 15 },
                { wch: 30 },
                { wch: 30 },
                { wch: 30 },
                { wch: 30 },
                { wch: 30 },
                { wch: 20 }
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
                            Lọc nhân viên
                            {havingFilters && (
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <StaffFilter
                        setHavingFilters={setHavingFilters}
                        onChange={buildQuery}
                        onSearch={onFilterSearch}
                        onReset={onResetFilterSearch}
                        roles={roles}
                    />
                </Popover>

                {hasAddPermission && <AddStaffDialog roles={roles} addNewStaffMutation={addNewStaffMutation} />}

                <Button onClick={exportCsvFile}>
                    <FileSpreadsheet /> Xuất file CSV
                </Button>
            </div>
        </div>
    )
}

export default StaffTableToolbar
