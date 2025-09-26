import { createBrowserRouter } from 'react-router-dom'
import ProfileRoutes from '@/features/profile/ProfileRoutes'
import AuthRoutes from '@/features/auth/AuthRoutes'

const developmentRoutes = createBrowserRouter([...ProfileRoutes, ...AuthRoutes])

const productionRoutes = createBrowserRouter([...ProfileRoutes, ...AuthRoutes])

const getRouter = (environment: 'development' | 'production') => {
    switch (environment) {
        case 'development':
            return developmentRoutes
        case 'production':
            return productionRoutes
        default:
            throw new Error('Invalid environment.')
    }
}

export default getRouter
