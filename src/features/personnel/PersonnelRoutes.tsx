import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import RoleManagementPage from '@/features/personnel/pages/RoleManagementPage'
import StaffManagementPage from '@/features/personnel/pages/StaffManagementPage'
import permissions from '@/configs/permissions'

const PersonnelRoutes = [
    {
        path: '/personnel',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/auth" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'staff-roles',
                element: (
                    <PermissionProtector
                        children={<RoleManagementPage />}
                        permission={permissions.accessRoleDashboardPage}
                    />
                )
            },
            {
                path: 'staffs',
                element: (
                    <PermissionProtector
                        children={<StaffManagementPage />}
                        permission={permissions.accessStaffDashboardPage}
                    />
                )
            }
        ]
    }
]

export default PersonnelRoutes
