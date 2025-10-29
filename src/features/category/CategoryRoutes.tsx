import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import CategoryManagementPage from '@/features/category/pages/CategoryManagementPage'

const CategoryRoutes = [
    {
        path: '/danh-muc',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/xac-thuc" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <CategoryManagementPage />
            }
        ]
    }
]

export default CategoryRoutes
