import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import OrderManagementPage from '@/features/order/pages/OrderManagementPage'

const OrderRoutes = [
    {
        path: '/don-hang',
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
                        children={<OrderManagementPage />}
                        permission={permissions.accessOrderDashboardPage}
                    />
                )
            }
        ]
    }
]

export default OrderRoutes
