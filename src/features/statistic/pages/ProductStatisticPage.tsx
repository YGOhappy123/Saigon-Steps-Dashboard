import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import ProductsSalesFilter from '@/features/statistic/components/ProductsSalesFilter'
import ProductSalesTable from '@/features/statistic/components/ProductSalesTable'

export type ReportData = {
    range: {
        from: string
        to: string
    }
    sales: {
        rootProductId: number
        rootProduct: {
            name: string
            slug: string
            images: Partial<IProductImage>[] | string[]
            brand: IProductBrand | string | null
            category: IShoeCategory | string | null
        }
        sales: {
            totalSales: number
            totalSoldUnits: number
            totalRefundedUnits: number
            totalRefundedAmount: number
        }
    }[]
}

const ProductStatisticPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [hasActivity, setHasActivity] = useState(true)
    const [reportData, setReportData] = useState<ReportData>({ range: { from: '', to: '' }, sales: [] })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">
                        Đây là thống kê chi tiết về doanh số sản phẩm của hệ thống Saigon Steps.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <ProductsSalesFilter hasActivity={hasActivity} setHasActivity={setHasActivity} onSuccess={setReportData} />
            <ProductSalesTable reportData={reportData} hasActivity={hasActivity} />
        </div>
    )
}

export default ProductStatisticPage
