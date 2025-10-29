import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import ImportManagementPage from '@/features/productImport/pages/ImportManagementPage'
import AddImportPage from '@/features/productImport/pages/AddImportPage'

const ProductImportRoutes = [
    {
        path: '/don-nhap-hang',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/xac-thuc" />
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
            },
            {
                path: 'them',
                element: <PermissionProtector children={<AddImportPage />} permission={permissions.addNewImport} />
            }
        ]
    }
]

export default ProductImportRoutes
