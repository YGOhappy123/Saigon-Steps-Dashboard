import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UseQueryResult } from '@tanstack/react-query'
import { FileSpreadsheet, Funnel, PencilLine } from 'lucide-react'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { exportToCSV } from '@/utils/exportCsvFile'
import { ProductSortAndFilterParams } from '@/features/product/services/productService'
import PageLimitSelect from '@/components/common/PageLimitSelect'
import ProductFilter from '@/features/product/components/ProductFilter'
import dayjs from '@/libs/dayjs'
import striptags from 'striptags'
import formatCurrency from '@/utils/formatCurrency'

type ProductTableToolbarProps = {
    limit: number
    setLimit: (limit: number) => void
    getCsvProductsQuery: UseQueryResult<any, any>
    buildQuery: (params: ProductSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    brands: IProductBrand[]
    categories: IShoeCategory[]
    hasAddPermission: boolean
}

const ProductTableToolbar = ({
    getCsvProductsQuery,
    limit,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    brands,
    categories,
    hasAddPermission
}: ProductTableToolbarProps) => {
    const navigate = useNavigate()
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        getCsvProductsQuery.refetch().then(res => {
            const csvProducts = res.data?.data?.data ?? []
            const formattedProducts = csvProducts.map((product: IRootProduct) => ({
                ['Mã sản phẩm']: product.rootProductId,
                ['Tên sản phẩm']: product.name,
                ['Loại sản phẩm']: product.isAccessory ? 'Phụ kiện' : 'Giày / dép',
                ['Mô tả']: striptags(product.description),
                ['Thương hiệu']: (product.brand as IProductBrand)?.name,
                ['Danh mục']: (product.shoeFeature?.category as IShoeCategory)?.name || 'Phụ kiện',
                ['Giá gốc (VNĐ)']: formatCurrency(product.price),
                ['Người tạo']: product.createdByStaff?.name ?? '(Không có)',
                ['Thời gian tạo']: dayjs(product.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                ['Số lượng tồn kho']:
                    (product.productItems ?? [])
                        .reduce((acc, item) => acc + (item.stock ?? 0), 0)
                        .toString()
                        .padStart(2, '0') + ' sản phẩm'
            }))

            exportToCSV(formattedProducts, `SS_danh_sach_san_pham ${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`, [
                { wch: 15 },
                { wch: 60 },
                { wch: 20 },
                { wch: 80 },
                { wch: 30 },
                { wch: 30 },
                { wch: 20 },
                { wch: 30 },
                { wch: 30 },
                { wch: 20 }
            ])
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
                            Lọc sản phẩm
                            {havingFilters && (
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <ProductFilter
                        setHavingFilters={setHavingFilters}
                        onChange={buildQuery}
                        onSearch={onFilterSearch}
                        onReset={onResetFilterSearch}
                        brands={brands}
                        categories={categories}
                    />
                </Popover>

                {hasAddPermission && (
                    <Button variant="lighter" onClick={() => navigate('/san-pham/them')}>
                        <PencilLine />
                        Thêm sản phẩm
                    </Button>
                )}

                <Button onClick={exportCsvFile}>
                    <FileSpreadsheet /> Xuất file CSV
                </Button>
            </div>
        </div>
    )
}

export default ProductTableToolbar
