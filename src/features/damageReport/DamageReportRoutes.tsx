import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import DamageManagementPage from '@/features/damageReport/pages/DamageManagementPage'
import AddDamagePage from '@/features/damageReport/pages/AddDamagePage'

const DamageReportRoutes = [
    {
        path: '/bao-cao-thiet-hai',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/xac-thuc" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: (
                    <PermissionProtector
                        children={<DamageManagementPage />}
                        permission={permissions.accessDamageReportDashboardPage}
                    />
                )
            },
            {
                path: 'them',
                element: (
                    <PermissionProtector children={<AddDamagePage />} permission={permissions.addNewDamageReport} />
                )
            }
        ]
    }
]

export default DamageReportRoutes
