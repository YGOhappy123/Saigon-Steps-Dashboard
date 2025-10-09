import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UseQueryResult } from '@tanstack/react-query'
import { FileSpreadsheet, Funnel, PencilLine } from 'lucide-react'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { exportToCSV } from '@/utils/exportCsvFile'
import { ImportSortAndFilterParams } from '@/features/productImport/services/importService'
import PageLimitSelect from '@/components/common/PageLimitSelect'
import ProductImportFilter from '@/features/productImport/components/ProductImportFilter'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type ProductImportTableToolbarProps = {
    limit: number
    setLimit: (limit: number) => void
    getCsvImportsQuery: UseQueryResult<any, any>
    buildQuery: (params: ImportSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
}

const ProductImportTableToolbar = ({
    getCsvImportsQuery,
    limit,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    hasAddPermission
}: ProductImportTableToolbarProps) => {
    const navigate = useNavigate()
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        getCsvImportsQuery.refetch().then(res => {
            const csvImports = res.data?.data?.data ?? []
            const formattedImports = csvImports.map((productImport: IProductImport) => ({
                ['Mã đơn nhập hàng']: productImport.importId,
                ['Mã hóa đơn']: productImport.invoiceNumber,
                ['Tổng tiền (VNĐ)']: formatCurrency(productImport.totalCost),
                ['Ngày nhập hàng']: dayjs(productImport.importDate).format('DD/MM/YYYY HH:mm:ss'),
                ['Người ghi nhận']: (productImport.trackedByStaff as IStaff | null)?.name,
                ['Thời gian ghi nhận']: dayjs(productImport.trackedAt).format('DD/MM/YYYY HH:mm:ss')
            }))

            exportToCSV(
                formattedImports,
                `SS_danh_sach_don_nhap_hang ${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`,
                [{ wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 30 }, { wch: 30 }, { wch: 30 }]
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
                            Lọc đơn nhập hàng
                            {havingFilters && (
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <ProductImportFilter
                        setHavingFilters={setHavingFilters}
                        onChange={buildQuery}
                        onSearch={onFilterSearch}
                        onReset={onResetFilterSearch}
                    />
                </Popover>

                {hasAddPermission && (
                    <Button variant="lighter" onClick={() => navigate('/product-imports/add')}>
                        <PencilLine />
                        Ghi nhận đơn nhập hàng
                    </Button>
                )}

                <Button onClick={exportCsvFile}>
                    <FileSpreadsheet /> Xuất file CSV
                </Button>
            </div>
        </div>
    )
}

export default ProductImportTableToolbar
