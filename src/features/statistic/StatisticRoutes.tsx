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
        path: '/thong-ke',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/xac-thuc" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'san-pham',
                element: (
                    <PermissionProtector
                        children={<ProductStatisticPage />}
                        permission={permissions.accessProductStatisticPage}
                    />
                )
            },
            {
                path: 'doanh-thu',
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
