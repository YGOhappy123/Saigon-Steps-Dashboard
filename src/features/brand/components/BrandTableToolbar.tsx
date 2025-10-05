import { useState } from 'react'
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { FileSpreadsheet, Funnel } from 'lucide-react'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { exportToCSV } from '@/utils/exportCsvFile'
import { BrandSortAndFilterParams } from '@/features/brand/services/brandService'
import striptags from 'striptags'
import PageLimitSelect from '@/components/common/PageLimitSelect'
import BrandFilter from '@/features/brand/components/BrandFilter'
import AddBrandDialog from '@/features/brand/components/AddBrandDialog'
import dayjs from '@/libs/dayjs'

type BrandTableToolbarProps = {
    limit: number
    setLimit: (limit: number) => void
    getCsvBrandsQuery: UseQueryResult<any, any>
    buildQuery: (params: BrandSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
    addNewBrandMutation: UseMutationResult<any, any, Partial<IProductBrand>, any>
}

const BrandTableToolbar = ({
    getCsvBrandsQuery,
    limit,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    hasAddPermission,
    addNewBrandMutation
}: BrandTableToolbarProps) => {
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        getCsvBrandsQuery.refetch().then(res => {
            const csvBrands = res.data?.data?.data ?? []
            const formattedBrands = csvBrands.map((brand: IProductBrand) => ({
                ['Mã thương hiệu']: brand.brandId,
                ['Tên thương hiệu']: brand.name,
                ['Mô tả']: striptags(brand.description)
            }))

            exportToCSV(
                formattedBrands,
                `SS_danh_sach_thuong_hieu ${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`,
                [{ wch: 15 }, { wch: 30 }, { wch: 80 }]
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
                            Lọc thương hiệu
                            {havingFilters && (
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <BrandFilter
                        setHavingFilters={setHavingFilters}
                        onChange={buildQuery}
                        onSearch={onFilterSearch}
                        onReset={onResetFilterSearch}
                    />
                </Popover>

                {hasAddPermission && <AddBrandDialog addNewBrandMutation={addNewBrandMutation} />}

                <Button onClick={exportCsvFile}>
                    <FileSpreadsheet /> Xuất file CSV
                </Button>
            </div>
        </div>
    )
}

export default BrandTableToolbar
