import { createBrowserRouter } from 'react-router-dom'
import AuthRoutes from '@/features/auth/AuthRoutes'
import ProfileRoutes from '@/features/profile/ProfileRoutes'
import CustomerRoutes from '@/features/customer/CustomerRoutes'
import PersonnelRoutes from '@/features/personnel/PersonnelRoutes'
import CategoryRoutes from '@/features/category/CategoryRoutes'
import BrandRoutes from '@/features/brand/BrandRoutes'
import ProductRoutes from '@/features/product/ProductRoutes'
import PromotionRoutes from '@/features/promotion/PromotionRoutes'
import OrderRoutes from '@/features/order/OrderRoutes'
import ProductImportRoutes from '@/features/productImport/ProductImportRoutes'
import DamageReportRoutes from '@/features/damageReport/DamageReportRoutes'
import StatisticRoutes from '@/features/statistic/StatisticRoutes'

const developmentRoutes = createBrowserRouter([
    ...AuthRoutes,
    ...ProfileRoutes,
    ...CustomerRoutes,
    ...PersonnelRoutes,
    ...CategoryRoutes,
    ...BrandRoutes,
    ...ProductRoutes,
    ...PromotionRoutes,
    ...OrderRoutes,
    ...ProductImportRoutes,
    ...DamageReportRoutes,
    ...StatisticRoutes
])
const productionRoutes = createBrowserRouter([
    ...AuthRoutes,
    ...ProfileRoutes,
    ...CustomerRoutes,
    ...PersonnelRoutes,
    ...CategoryRoutes,
    ...BrandRoutes,
    ...ProductRoutes,
    ...PromotionRoutes,
    ...OrderRoutes,
    ...ProductImportRoutes,
    ...DamageReportRoutes,
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
