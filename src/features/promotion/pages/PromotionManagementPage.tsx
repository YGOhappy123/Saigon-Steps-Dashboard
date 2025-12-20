import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import useAxiosIns from '@/hooks/useAxiosIns'
import PromotionTable from '@/features/promotion/components/PromotionTable'
import DataPromotionDialog from '@/features/promotion/components/DataPromotionDialog'
import promotionService from '@/features/promotion/services/promotionService'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'

const PromotionManagementPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<'view' | 'update'>('view')
    const [selectedPromotion, setSelectedPromotion] = useState<IPromotion | null>(null)
    const promotionServiceData = promotionService({ enableFetching: true })

    const fetchAllProductsQuery = useQuery({
        queryKey: ['products-all'],
        queryFn: () => axios.get<IResponseData<IRootProduct[]>>('/products'),
        enabled: true,
        select: res => res.data
    })
    const products = fetchAllProductsQuery.data?.data || []

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">
                        Đây là danh sách chương trình khuyến mãi của hệ thống Saigon Steps.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <DataPromotionDialog
                promotion={selectedPromotion}
                products={products}
                mode={dialogMode}
                setMode={setDialogMode}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updatePromotionMutation={promotionServiceData.updatePromotionMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updatePromotion)}
            />

            <PromotionTable
                promotions={promotionServiceData.promotions}
                products={products}
                total={promotionServiceData.total}
                page={promotionServiceData.page}
                limit={promotionServiceData.limit}
                setPage={promotionServiceData.setPage}
                setLimit={promotionServiceData.setLimit}
                buildQuery={promotionServiceData.buildQuery}
                onFilterSearch={promotionServiceData.onFilterSearch}
                onResetFilterSearch={promotionServiceData.onResetFilterSearch}
                hasAddPermission={verifyPermission(user, appPermissions.addNewPromotion)}
                hasUpdatePermission={verifyPermission(user, appPermissions.updatePromotion)}
                hasDisablePermission={verifyPermission(user, appPermissions.disablePromotion)}
                onViewPromotion={(promotion: IPromotion) => {
                    setSelectedPromotion(promotion)
                    setDialogMode('view')
                    setDialogOpen(true)
                }}
                onUpdatePromotion={(promotion: IPromotion) => {
                    setSelectedPromotion(promotion)
                    setDialogMode('update')
                    setDialogOpen(true)
                }}
                getCsvPromotionsQuery={promotionServiceData.getCsvPromotionsQuery}
                addNewPromotionMutation={promotionServiceData.addNewPromotionMutation}
                disablePromotionMutation={promotionServiceData.disablePromotionMutation}
            />
        </div>
    )
}

export default PromotionManagementPage
