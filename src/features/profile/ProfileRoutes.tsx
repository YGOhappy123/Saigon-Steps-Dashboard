import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import EditProfilePage from '@/features/profile/pages/EditProfilePage'
import ChangePasswordPage from '@/features/profile/pages/ChangePasswordPage'

const ProfileRoutes = [
    {
        path: '/',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/xac-thuc" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <Navigate to="/cap-nhat-thong-tin" replace />
            },
            {
                path: 'cap-nhat-thong-tin',
                element: <EditProfilePage />
            },
            {
                path: 'doi-mat-khau',
                element: <ChangePasswordPage />
            }
        ]
    }
]

export default ProfileRoutes
