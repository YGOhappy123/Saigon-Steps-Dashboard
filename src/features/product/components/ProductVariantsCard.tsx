import { ColumnDef } from '@tanstack/react-table'
import { ScanBarcode } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { sections } from '@/features/product/components/TableOfContents'
import ProductPriceForm from '@/features/product/components/ProductPriceForm'

type ProductVariantsCardProps = {
    product: IRootProduct
    hasModifyItemPermission: boolean
    onUpdateSuccess: () => Promise<any>
}

const ProductVariantsCard = ({ product, hasModifyItemPermission, onUpdateSuccess }: ProductVariantsCardProps) => {
    const section = sections.variants
    const columns: ColumnDef<Partial<IProductItem>>[] = [
        {
            accessorKey: 'productItemId',
            header: () => <div className="text-center">Mã chi tiết sản phẩm</div>,
            cell: ({ row }) => <div>{row.original.productItemId}</div>
        },
        {
            accessorKey: 'size',
            header: () => <div className="text-center">Kích thước / Phân loại</div>,
            cell: ({ row }) => <div className="text-center">{row.original.size}</div>
        },
        {
            accessorKey: 'stock',
            header: () => <div className="text-center">Số lượng tồn kho</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
                        <ScanBarcode /> {row.original.stock?.toString().padStart(2, '0')}
                    </Badge>
                </div>
            )
        }
    ]

    return (
        <Card className="w-full max-w-4xl" id={section.id}>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <CardDescription>
                    {hasModifyItemPermission
                        ? 'Cập nhật giá cả sản phẩm bẳng cách ấn vào nút "Chỉnh sửa" tại mục này'
                        : 'Tài khoản của bạn không được cấp quyền cập nhật giá cả sản phẩm'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3">
                    <h4 className="text-lg font-semibold">Danh sách chi tiết sản phẩm</h4>
                    <DataTable data={product.productItems ?? []} columns={columns} />
                </div>

                <div className="mt-6 flex flex-col gap-2">
                    <h4 className="text-lg font-semibold">Giá sản phẩm</h4>
                    <ProductPriceForm
                        product={product}
                        hasModifyItemPermission={hasModifyItemPermission}
                        onUpdateSuccess={onUpdateSuccess}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductVariantsCard
