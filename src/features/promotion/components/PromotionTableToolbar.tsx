import { useState } from 'react'
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { FileSpreadsheet, Funnel } from 'lucide-react'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { exportToCSV } from '@/utils/exportCsvFile'
import { PromotionSortAndFilterParams } from '@/features/promotion/services/promotionService'
import PageLimitSelect from '@/components/common/PageLimitSelect'
import PromotionsFilter from '@/features/promotion/components/PromotionFilter'
import AddPromotionsDialog from '@/features/promotion/components/AddPromotionDialog'
import dayjs from '@/libs/dayjs'

type PromotionsTableToolbarProps = {
    limit: number
    setLimit: (limit: number) => void
    getCsvPromotionsQuery: UseQueryResult<any, any>
    buildQuery: (params: PromotionSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    products: IRootProduct[]
    hasAddPermission: boolean
    addNewPromotionMutation: UseMutationResult<any, any, Partial<IPromotion>, any>
}

const PromotionsTableToolbar = ({
    getCsvPromotionsQuery,
    limit,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    products,
    hasAddPermission,
    addNewPromotionMutation
}: PromotionsTableToolbarProps) => {
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        getCsvPromotionsQuery.refetch().then(res => {
            const csvPromotions = res.data?.data?.data ?? []
            const formattedPromotions = csvPromotions.map((promotion: IPromotion) => ({
                ['Mã khuyến mãi']: promotion.promotionId,
                ['Tên khuyến mãi']: promotion.name,
                ['Mô tả']: promotion.description,
                ['Phần trăm giảm giá (%)']: promotion.discountRate,
                ['Trạng thái']: promotion.isActive ? 'Chưa bị khóa' : 'Đã bị khóa',
                ['Thời gian bắt đầu']: dayjs(promotion.startDate).format('DD/MM/YYYY'),
                ['Thời gian kết thúc']: dayjs(promotion.endDate).format('DD/MM/YYYY'),
                ['Người tạo']: promotion.createdByStaff?.name ?? '(Không có)',
                ['Thời gian tạo']: dayjs(promotion.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                ['Danh sách sản phẩm']: (promotion.products ?? [])
                    .map(product => (product as IRootProduct).name)
                    .join(', ')
            }))

            exportToCSV(
                formattedPromotions,
                `SS_danh_sach_khuyen_mai ${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`,
                [
                    { wch: 15 },
                    { wch: 40 },
                    { wch: 80 },
                    { wch: 20 },
                    { wch: 20 },
                    { wch: 20 },
                    { wch: 20 },
                    { wch: 30 },
                    { wch: 30 },
                    { wch: 80 }
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
                            Lọc khuyến mãi
                            {havingFilters && (
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PromotionsFilter
                        setHavingFilters={setHavingFilters}
                        onChange={buildQuery}
                        onSearch={onFilterSearch}
                        onReset={onResetFilterSearch}
                        products={products}
                    />
                </Popover>

                {hasAddPermission && (
                    <AddPromotionsDialog products={products} addNewPromotionMutation={addNewPromotionMutation} />
                )}

                <Button onClick={exportCsvFile}>
                    <FileSpreadsheet /> Xuất file CSV
                </Button>
            </div>
        </div>
    )
}

export default PromotionsTableToolbar
