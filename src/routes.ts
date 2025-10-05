import { createBrowserRouter } from 'react-router-dom'
import AuthRoutes from '@/features/auth/AuthRoutes'
import ProfileRoutes from '@/features/profile/ProfileRoutes'
import CustomerRoutes from '@/features/customer/CustomerRoutes'
import PersonnelRoutes from '@/features/personnel/PersonnelRoutes'
import CategoryRoutes from '@/features/category/CategoryRoutes'
import BrandRoutes from '@/features/brand/BrandRoutes'
import StatisticRoutes from '@/features/statistic/StatisticRoutes'

const developmentRoutes = createBrowserRouter([
    ...AuthRoutes,
    ...ProfileRoutes,
    ...CustomerRoutes,
    ...PersonnelRoutes,
    ...CategoryRoutes,
    ...BrandRoutes,
    ...StatisticRoutes
])
const productionRoutes = createBrowserRouter([
    ...AuthRoutes,
    ...ProfileRoutes,
    ...CustomerRoutes,
    ...PersonnelRoutes,
    ...CategoryRoutes,
    ...BrandRoutes,
    ...StatisticRoutes
])

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
