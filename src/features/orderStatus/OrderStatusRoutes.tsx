import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import StatusManagementPage from '@/features/orderStatus/pages/StatusManagementPage'
import TransitionManagementPage from '@/features/orderStatus/pages/TransitionManagementPage'

const OrderStatusRoutes = [
    {
        path: '/trang-thai-don-hang',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/xac-thuc" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <StatusManagementPage />
            },
            {
                path: 'chuyen-trang-thai',
                element: (
                    <PermissionProtector
                        permission={permissions.accessTransitionDashboardPage}
                        children={<TransitionManagementPage />}
                    />
                )
            }
        ]
    }
]

export default OrderStatusRoutes
