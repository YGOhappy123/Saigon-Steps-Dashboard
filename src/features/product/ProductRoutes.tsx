import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import ProductManagementPage from '@/features/product/pages/ProductManagementPage'
import ProductDetailPage from '@/features/product/pages/ProductDetailPage'
import PermissionProtector from '@/components/container/PermissionProtector'
import AddProductPage from '@/features/product/pages/AddProductPage'
import permissions from '@/configs/permissions'

const ProductRoutes = [
    {
        path: '/products',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/auth" />
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
            },
            {
                path: 'add',
                element: <PermissionProtector children={<AddProductPage />} permission={permissions.addNewProduct} />
            }
        ]
    }
]

export default ProductRoutes
