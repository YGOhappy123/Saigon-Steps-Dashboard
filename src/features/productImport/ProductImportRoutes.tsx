import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import ImportManagementPage from '@/features/productImport/pages/ImportManagement'

const ProductImportRoutes = [
    {
        path: '/product-imports',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/auth" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: (
                    <PermissionProtector
                        children={<ImportManagementPage />}
                        permission={permissions.accessImportDashboardPage}
                    />
                )
            }
            // {
            //     path: 'add',
            //     element: <PermissionProtector children={<AddImportPage />} permission={permissions.addNewImport} />
            // }
        ]
    }
]

export default ProductImportRoutes
