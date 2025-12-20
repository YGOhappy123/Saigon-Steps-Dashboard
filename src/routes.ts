import { createBrowserRouter } from 'react-router-dom'
import AuthRoutes from '@/features/auth/AuthRoutes'
import ProfileRoutes from '@/features/profile/ProfileRoutes'
import CustomerRoutes from '@/features/customer/CustomerRoutes'
import PersonnelRoutes from '@/features/personnel/PersonnelRoutes'
import CategoryRoutes from '@/features/category/CategoryRoutes'
import BrandRoutes from '@/features/brand/BrandRoutes'
import ProductRoutes from '@/features/product/ProductRoutes'
import OrderRoutes from '@/features/order/OrderRoutes'
import OrderStatusRoutes from '@/features/orderStatus/OrderStatusRoutes'
import ProductImportRoutes from '@/features/productImport/ProductImportRoutes'
import DamageReportRoutes from '@/features/damageReport/DamageReportRoutes'
import InventoryRoutes from '@/features/inventory/InventoryRoutes'
import StatisticRoutes from '@/features/statistic/StatisticRoutes'

const developmentRoutes = createBrowserRouter([
    ...AuthRoutes,
    ...ProfileRoutes,
    ...CustomerRoutes,
    ...PersonnelRoutes,
    ...CategoryRoutes,
    ...BrandRoutes,
    ...ProductRoutes,
    ...OrderRoutes,
    ...OrderStatusRoutes,
    ...ProductImportRoutes,
    ...DamageReportRoutes,
    ...InventoryRoutes,
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
    ...OrderRoutes,
    ...OrderStatusRoutes,
    ...ProductImportRoutes,
    ...DamageReportRoutes,
    ...InventoryRoutes,
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
