import { createBrowserRouter } from 'react-router-dom'
import AuthRoutes from '@/features/auth/AuthRoutes'
import ProfileRoutes from '@/features/profile/ProfileRoutes'
import CustomerRoutes from '@/features/customer/CustomerRoutes'
import PersonnelRoutes from '@/features/personnel/PersonnelRoutes'

const developmentRoutes = createBrowserRouter([...AuthRoutes, ...ProfileRoutes, ...CustomerRoutes, ...PersonnelRoutes])
const productionRoutes = createBrowserRouter([...AuthRoutes, ...ProfileRoutes, ...CustomerRoutes, ...PersonnelRoutes])

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
