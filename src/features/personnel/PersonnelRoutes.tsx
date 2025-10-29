import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import RoleManagementPage from '@/features/personnel/pages/RoleManagementPage'
import StaffManagementPage from '@/features/personnel/pages/StaffManagementPage'

const PersonnelRoutes = [
    {
        path: '/nhan-su',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/xac-thuc" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'vai-tro',
                element: (
                    <PermissionProtector
                        children={<RoleManagementPage />}
                        permission={permissions.accessRoleDashboardPage}
                    />
                )
            },
            {
                path: 'nhan-vien',
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
