import { createBrowserRouter } from 'react-router-dom'
import ProfileRoutes from '@/features/profile/ProfileRoutes'

const developmentRoutes = createBrowserRouter([...ProfileRoutes])

const productionRoutes = createBrowserRouter([...ProfileRoutes])

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
