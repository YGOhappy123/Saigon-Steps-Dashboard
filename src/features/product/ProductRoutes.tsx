import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import ProductManagementPage from '@/features/product/pages/ProductManagementPage'
import ProductDetailPage from '@/features/product/pages/ProductDetailPage'

const ProductRoutes = [
    {
        path: '/san-pham',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/xac-thuc" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <ProductManagementPage />
            },
            {
                path: ':slug',
                element: <ProductDetailPage />
            }
        ]
    }
]

export default ProductRoutes
