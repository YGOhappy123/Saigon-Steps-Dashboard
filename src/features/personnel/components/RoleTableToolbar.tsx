import { useState } from 'react'
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { FileSpreadsheet, Funnel } from 'lucide-react'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { exportToCSV } from '@/utils/exportCsvFile'
import { RoleSortAndFilterParams } from '@/features/personnel/services/roleService'
import PageLimitSelect from '@/components/common/PageLimitSelect'
import RoleFilter from '@/features/personnel/components/RoleFilter'
import AddRoleDialog from '@/features/personnel/components/AddRoleDialog'
import dayjs from '@/libs/dayjs'

type RoleTableToolbarProps = {
    limit: number
    setLimit: (limit: number) => void
    getCsvRolesQuery: UseQueryResult<any, any>
    buildQuery: (params: RoleSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    permissions: IPermission[]
    hasAddPermission: boolean
    addNewRoleMutation: UseMutationResult<any, any, Partial<IStaffRole>, any>
}

const RoleTableToolbar = ({
    getCsvRolesQuery,
    limit,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    permissions,
    hasAddPermission,
    addNewRoleMutation
}: RoleTableToolbarProps) => {
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        getCsvRolesQuery.refetch().then(res => {
            const csvRoles = res.data?.data?.data ?? []
            const formattedRoles = csvRoles.map((role: IStaffRole) => ({
                ['Mã vai trò']: role.roleId,
                ['Tên vai trò']: role.name,
                ['Loại vai trò']: role.isImmutable ? 'Không thể chỉnh sửa' : 'Có thể chỉnh sửa',
                ['Danh sách quyền truy cập']: (role.permissions ?? [])
                    .map(permission => (permission as IPermission).name)
                    .join(', ')
            }))

            exportToCSV(formattedRoles, `SS_danh_sach_vai_tro_${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`, [
                { wch: 15 },
                { wch: 20 },
                { wch: 20 },
                { wch: 80 }
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
                            Lọc vai trò
                            {havingFilters && (
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <RoleFilter
                        setHavingFilters={setHavingFilters}
                        onChange={buildQuery}
                        onSearch={onFilterSearch}
                        onReset={onResetFilterSearch}
                        permissions={permissions}
                    />
                </Popover>

                {hasAddPermission && (
                    <AddRoleDialog permissions={permissions} addNewRoleMutation={addNewRoleMutation} />
                )}

                <Button onClick={exportCsvFile}>
                    <FileSpreadsheet /> Xuất file CSV
                </Button>
            </div>
        </div>
    )
}

export default RoleTableToolbar
