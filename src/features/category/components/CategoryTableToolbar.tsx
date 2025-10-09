import { useState } from 'react'
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { FileSpreadsheet, Funnel } from 'lucide-react'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { exportToCSV } from '@/utils/exportCsvFile'
import { CategorySortAndFilterParams } from '@/features/category/services/categoryService'
import PageLimitSelect from '@/components/common/PageLimitSelect'
import CategoryFilter from '@/features/category/components/CategoryFilter'
import AddCategoryDialog from '@/features/category/components/AddCategoryDialog'
import dayjs from '@/libs/dayjs'

type CategoryTableToolbarProps = {
    limit: number
    setLimit: (limit: number) => void
    getCsvCategoriesQuery: UseQueryResult<any, any>
    buildQuery: (params: CategorySortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
    addNewCategoryMutation: UseMutationResult<any, any, Partial<IShoeCategory>, any>
}

const CategoryTableToolbar = ({
    getCsvCategoriesQuery,
    limit,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    hasAddPermission,
    addNewCategoryMutation
}: CategoryTableToolbarProps) => {
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        getCsvCategoriesQuery.refetch().then(res => {
            const csvCategories = res.data?.data?.data ?? []
            const formattedCategories = csvCategories.map((category: IShoeCategory) => ({
                ['Mã danh mục']: category.categoryId,
                ['Tên danh mục']: category.name,
                ['Người tạo']: (category.createdByStaff as IStaff | null)?.name,
                ['Thời gian tạo']: dayjs(category.createdAt).format('DD/MM/YYYY HH:mm:ss')
            }))

            exportToCSV(
                formattedCategories,
                `SS_danh_sach_danh_muc ${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`,
                [{ wch: 15 }, { wch: 30 }, { wch: 30 }, { wch: 30 }]
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
                            Lọc danh mục
                            {havingFilters && (
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <CategoryFilter
                        setHavingFilters={setHavingFilters}
                        onChange={buildQuery}
                        onSearch={onFilterSearch}
                        onReset={onResetFilterSearch}
                    />
                </Popover>

                {hasAddPermission && <AddCategoryDialog addNewCategoryMutation={addNewCategoryMutation} />}

                <Button onClick={exportCsvFile}>
                    <FileSpreadsheet /> Xuất file CSV
                </Button>
            </div>
        </div>
    )
}

export default CategoryTableToolbar
