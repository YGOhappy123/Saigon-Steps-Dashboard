import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import ProductStatisticPage from '@/features/statistic/pages/ProductStatisticPage'
import RevenueStatisticPage from '@/features/statistic/pages/RevenueStatisticPage'

const StatisticRoutes = [
    {
        path: '/statistics',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/auth" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'product',
                element: (
                    <PermissionProtector
                        children={<ProductStatisticPage />}
                        permission={permissions.accessProductStatisticPage}
                    />
                )
            },
            {
                path: 'revenue',
                element: (
                    <PermissionProtector
                        children={<RevenueStatisticPage />}
                        permission={permissions.accessRevenueStatisticPage}
                    />
                )
            }
        ]
    }
]

export default StatisticRoutes
