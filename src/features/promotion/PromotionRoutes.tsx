import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import CouponManagementPage from '@/features/promotion/pages/CouponManagementPage'
import permissions from '@/configs/permissions'
import PromotionManagementPage from '@/features/promotion/pages/PromotionManagementPage'

const PromotionRoutes = [
    {
        path: '/promotions',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/auth" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <PromotionManagementPage />
            },
            {
                path: 'coupons',
                element: (
                    <PermissionProtector
                        children={<CouponManagementPage />}
                        permission={permissions.accessCouponDashboardPage}
                    />
                )
            }
        ]
    }
]

export default PromotionRoutes
