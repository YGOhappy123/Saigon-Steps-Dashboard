import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'

import useAxiosIns from '@/hooks/useAxiosIns'
import RoleTable from '@/features/personnel/components/RoleTable'
import DataRoleDialog from '@/features/personnel/components/DataRoleDialog'
import roleService from '@/features/personnel/services/roleService'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'

const RoleManagementPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<'view' | 'update'>('view')
    const [selectedRole, setSelectedRole] = useState<IStaffRole | null>(null)
    const {
        roles,
        total,
        page,
        limit,
        setPage,
        setLimit,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        getCsvRolesQuery,
        addNewRoleMutation,
        updateRoleMutation,
        removeRoleMutation
    } = roleService({
        enableFetching: true
    })

    const fetchAllPermissionsQuery = useQuery({
        queryKey: ['permissions-all'],
        queryFn: () => axios.get<IResponseData<IPermission[]>>('/roles/permissions'),
        enabled: true,
        select: res => res.data
    })
    const permissions = fetchAllPermissionsQuery.data?.data || []

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">
                        Đây là danh sách vai trò nhân viên của hệ thống Saigon Steps.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <DataRoleDialog
                role={selectedRole}
                permissions={permissions}
                mode={dialogMode}
                setMode={setDialogMode}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updateRoleMutation={updateRoleMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateRole)}
            />

            <RoleTable
                roles={roles}
                permissions={permissions}
                total={total}
                page={page}
                limit={limit}
                setPage={setPage}
                setLimit={setLimit}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
                hasAddPermission={verifyPermission(user, appPermissions.addNewRole)}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateRole)}
                hasDeletePermission={verifyPermission(user, appPermissions.removeRole)}
                onViewRole={(role: IStaffRole) => {
                    setSelectedRole(role)
                    setDialogMode('view')
                    setDialogOpen(true)
                }}
                onUpdateRole={(role: IStaffRole) => {
                    setSelectedRole(role)
                    setDialogMode('update')
                    setDialogOpen(true)
                }}
                getCsvRolesQuery={getCsvRolesQuery}
                addNewRoleMutation={addNewRoleMutation}
                removeRoleMutation={removeRoleMutation}
            />
        </div>
    )
}

export default RoleManagementPage
