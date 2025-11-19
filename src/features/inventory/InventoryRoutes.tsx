import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import InventoryUpdateLogPage from '@/features/inventory/pages/InventoryUpdateLogPage'

const InventoryRoutes = [
    {
        path: '/ton-kho',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/xac-thuc" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'lich-su-nhap-xuat-kho',
                element: (
                    <PermissionProtector
                        children={<InventoryUpdateLogPage />}
                        permission={permissions.accessInventoryDashboardPage}
                    />
                )
            }
        ]
    }
]

export default InventoryRoutes
