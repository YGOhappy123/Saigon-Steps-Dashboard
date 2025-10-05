import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import staffService from '@/features/personnel/services/staffService'
import useAxiosIns from '@/hooks/useAxiosIns'
import DataStaffDialog from '@/features/personnel/components/DataStaffDialog'
import ChangeRoleDialog from '@/features/personnel/components/ChangeRoleDialog'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'
import StaffTable from '@/features/personnel/components/StaffTable'

const StaffManagementPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false)
    const [dataDialogOpen, setDataDialogOpen] = useState(false)
    const [dataDialogMode, setDataDialogMode] = useState<'view' | 'update'>('view')
    const [selectedStaff, setSelectedStaff] = useState<IStaff | null>(null)
    const staffServiceData = staffService({ enableFetching: true })

    const fetchAllRolesQuery = useQuery({
        queryKey: ['roles-all'],
        queryFn: () => axios.get<IResponseData<IStaffRole[]>>('/roles'),
        enabled: true,
        select: res => res.data
    })
    const roles = fetchAllRolesQuery.data?.data || []

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách nhân viên của hệ thống Saigon Steps.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <DataStaffDialog
                staff={selectedStaff}
                mode={dataDialogMode}
                setMode={setDataDialogMode}
                open={dataDialogOpen}
                setOpen={setDataDialogOpen}
                updateStaffInfoMutation={staffServiceData.updateStaffInfoMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateStaffInformation)}
            />

            <ChangeRoleDialog
                staff={selectedStaff}
                roles={roles}
                open={changeRoleDialogOpen}
                setOpen={setChangeRoleDialogOpen}
                changeStaffRoleMutation={staffServiceData.changeStaffRoleMutation}
                hasChangeRolePermission={verifyPermission(user, appPermissions.changeStaffRole)}
            />

            <StaffTable
                staffs={staffServiceData.staffs}
                roles={roles}
                total={staffServiceData.total}
                page={staffServiceData.page}
                limit={staffServiceData.limit}
                setPage={staffServiceData.setPage}
                setLimit={staffServiceData.setLimit}
                buildQuery={staffServiceData.buildQuery}
                onFilterSearch={staffServiceData.onFilterSearch}
                onResetFilterSearch={staffServiceData.onResetFilterSearch}
                hasAddPermission={verifyPermission(user, appPermissions.addNewStaff)}
                hasUpdateInfoPermission={verifyPermission(user, appPermissions.updateStaffInformation)}
                hasChangeRolePermission={verifyPermission(user, appPermissions.changeStaffRole)}
                hasDeactivateAccountPermission={verifyPermission(user, appPermissions.deactivateStaffAccount)}
                onViewStaff={(staff: IStaff) => {
                    setSelectedStaff(staff)
                    setDataDialogMode('view')
                    setDataDialogOpen(true)
                }}
                onUpdateStaffInfo={(staff: IStaff) => {
                    setSelectedStaff(staff)
                    setDataDialogMode('update')
                    setDataDialogOpen(true)
                }}
                onChangeStaffRole={(staff: IStaff) => {
                    setSelectedStaff(staff)
                    setChangeRoleDialogOpen(true)
                }}
                getCsvStaffsQuery={staffServiceData.getCsvStaffsQuery}
                addNewStaffMutation={staffServiceData.addNewStaffMutation}
                deactivateStaffAccountMutation={staffServiceData.deactivateStaffAccountMutation}
            />
        </div>
    )
}

export default StaffManagementPage
