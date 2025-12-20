import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import PromotionManagementPage from '@/features/promotion/pages/PromotionManagementPage'
import CouponManagementPage from '@/features/promotion/pages/CouponManagementPage'

const PromotionRoutes = [
    {
        path: '/khuyen-mai',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/xac-thuc" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <PromotionManagementPage />
            },
            {
                path: 'phieu-giam-gia',
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
