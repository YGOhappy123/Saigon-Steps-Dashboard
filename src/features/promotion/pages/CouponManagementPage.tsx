import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import CouponTable from '@/features/promotion/components/CouponTable'
import DataCouponDialog from '@/features/promotion/components/DataCouponDialog'
import couponService from '@/features/promotion/services/couponService'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'

const CouponManagementPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null)
    const couponServiceData = couponService({ enableFetching: true })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách phiếu giảm giá của hệ thống Saigon Steps.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <DataCouponDialog coupon={selectedCoupon} open={dialogOpen} setOpen={setDialogOpen} />

            <CouponTable
                coupons={couponServiceData.coupons}
                total={couponServiceData.total}
                page={couponServiceData.page}
                limit={couponServiceData.limit}
                setPage={couponServiceData.setPage}
                setLimit={couponServiceData.setLimit}
                buildQuery={couponServiceData.buildQuery}
                onFilterSearch={couponServiceData.onFilterSearch}
                onResetFilterSearch={couponServiceData.onResetFilterSearch}
                hasAddPermission={verifyPermission(user, appPermissions.addNewCoupon)}
                hasDisablePermission={verifyPermission(user, appPermissions.disableCoupon)}
                onViewCoupon={(coupon: ICoupon) => {
                    setSelectedCoupon(coupon)
                    setDialogOpen(true)
                }}
                getCsvCouponsQuery={couponServiceData.getCsvCouponsQuery}
                addNewCouponMutation={couponServiceData.addNewCouponMutation}
                disableCouponMutation={couponServiceData.disableCouponMutation}
            />
        </div>
    )
}

export default CouponManagementPage
