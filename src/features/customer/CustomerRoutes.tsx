import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import CustomerListPage from '@/features/customer/pages/CustomerListPage'
import CustomerChatPage from '@/features/customer/pages/CustomerChatPage'

const CustomerRoutes = [
    {
        path: '/khach-hang',
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
                        children={<CustomerListPage />}
                        permission={permissions.accessCustomerDashboardPage}
                    />
                )
            },
            {
                path: 'tro-chuyen',
                element: (
                    <PermissionProtector
                        children={<CustomerChatPage />}
                        permission={permissions.accessAdvisoryDashboardPage}
                    />
                )
            }
        ]
    }
]

export default CustomerRoutes
