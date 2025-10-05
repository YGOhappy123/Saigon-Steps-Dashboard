import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import BrandManagementPage from '@/features/brand/pages/BrandManagementPage'

const BrandRoutes = [
    {
        path: '/brands',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/auth" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <BrandManagementPage />
            }
        ]
    }
]

export default BrandRoutes
