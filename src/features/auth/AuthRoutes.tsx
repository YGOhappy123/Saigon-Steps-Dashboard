import { Suspense } from 'react'
import AuthPage from '@/features/auth/pages/AuthPage'
import ErrorPage from '@/pages/ErrorPage'

const AuthRoutes = [
    {
        path: '/auth',
        element: (
            <Suspense>
                <AuthPage />
            </Suspense>
        ),
        errorElement: <ErrorPage />
    }
]

export default AuthRoutes
