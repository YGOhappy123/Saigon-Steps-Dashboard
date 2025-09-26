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
                <AuthProtector children={<DashboardLayout />} redirect="/auth" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <Navigate to="/profile" replace />
            },
            {
                path: 'profile',
                element: <EditProfilePage />
            },
            {
                path: 'change-password',
                element: <ChangePasswordPage />
            }
        ]
    }
]

export default ProfileRoutes
