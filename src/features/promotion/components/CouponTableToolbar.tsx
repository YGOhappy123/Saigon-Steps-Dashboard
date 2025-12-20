import { useState } from 'react'
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { FileSpreadsheet, Funnel } from 'lucide-react'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { exportToCSV } from '@/utils/exportCsvFile'
import { CouponSortAndFilterParams } from '@/features/promotion/services/couponService'
import { COUPON_TYPE_MAP } from '@/configs/constants'
import PageLimitSelect from '@/components/common/PageLimitSelect'
import CouponsFilter from '@/features/promotion/components/CouponFilter'
import AddCouponsDialog from '@/features/promotion/components/AddCouponDialog'
import dayjs from '@/libs/dayjs'
import formatCurrency from '@/utils/formatCurrency'

type CouponsTableToolbarProps = {
    limit: number
    setLimit: (limit: number) => void
    getCsvCouponsQuery: UseQueryResult<any, any>
    buildQuery: (params: CouponSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
    addNewCouponMutation: UseMutationResult<any, any, Partial<ICoupon>, any>
}

const CouponsTableToolbar = ({
    getCsvCouponsQuery,
    limit,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    hasAddPermission,
    addNewCouponMutation
}: CouponsTableToolbarProps) => {
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        getCsvCouponsQuery.refetch().then(res => {
            const csvCoupons = res.data?.data?.data ?? []
            const formattedCoupons = csvCoupons.map((coupon: ICoupon) => ({
                ['Mã phiếu giảm giá']: coupon.couponId,
                ['Mã code']: coupon.code,
                ['Loại giảm giá']: COUPON_TYPE_MAP[coupon.type],
                ['Giá trị giảm']:
                    coupon.type === 'FIXED'
                        ? formatCurrency(coupon.amount)
                        : `${coupon.amount.toString().padStart(2, '0')}%`,
                ['Trạng thái']: coupon.isActive ? 'Chưa bị khóa' : 'Đã bị khóa',
                ['Lượt dùng tối đa']: coupon.maxUsage
                    ? coupon.maxUsage.toString().padStart(2, '0')
                    : '(Không giới hạn)',
                ['Thời gian kết thúc']: coupon.expiredAt
                    ? dayjs(coupon.expiredAt).format('DD/MM/YYYY')
                    : '(Không giới hạn)',
                ['Người tạo']: coupon.createdByStaff?.name ?? '(Không có)',
                ['Thời gian tạo']: dayjs(coupon.createdAt).format('DD/MM/YYYY HH:mm:ss')
            }))

            exportToCSV(
                formattedCoupons,
                `SS_danh_sach_phieu_giam_gia ${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`,
                [
                    { wch: 15 },
                    { wch: 30 },
                    { wch: 30 },
                    { wch: 20 },
                    { wch: 20 },
                    { wch: 20 },
                    { wch: 20 },
                    { wch: 30 },
                    { wch: 30 }
                ]
            )
        })
    }

    return (
        <div className="flex items-center justify-between">
            <PageLimitSelect limit={limit} setLimit={setLimit} />

            <div className="flex justify-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="relative">
                            <Funnel />
                            Lọc phiếu giảm giá
                            {havingFilters && (
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <CouponsFilter
                        setHavingFilters={setHavingFilters}
                        onChange={buildQuery}
                        onSearch={onFilterSearch}
                        onReset={onResetFilterSearch}
                    />
                </Popover>

                {hasAddPermission && <AddCouponsDialog addNewCouponMutation={addNewCouponMutation} />}

                <Button onClick={exportCsvFile}>
                    <FileSpreadsheet /> Xuất file CSV
                </Button>
            </div>
        </div>
    )
}

export default CouponsTableToolbar
