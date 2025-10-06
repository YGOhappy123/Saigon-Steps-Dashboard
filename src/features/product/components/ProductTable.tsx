import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { ScanBarcode, Footprints, MoreHorizontal, Wallet, Crown, BadgeDollarSign, ArrowRight } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProductSortAndFilterParams } from '@/features/product/services/productService'
import striptags from 'striptags'
import ProductTableToolbar from '@/features/product/components/ProductTableToolbar'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import Pagination from '@/components/common/Pagination'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type ProductTableProps = {
    products: IRootProduct[]
    brands: IProductBrand[]
    categories: IShoeCategory[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    buildQuery: (params: ProductSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
    hasAddPermission: boolean
    hasUpdateInfoPermission: boolean
    hasUpdatePricePermission: boolean
    hasDeletePermission: boolean
    onViewProduct: (value: IRootProduct) => void
    onUpdateProductInfo: (value: IRootProduct) => void
    onUpdateProductPrice: (value: IRootProduct) => void
    getCsvProductsQuery: UseQueryResult<any, any>
    deleteProductMutation: UseMutationResult<any, any, number, any>
}

export const productTypes = [
    {
        value: false,
        label: 'Giày / dép',
        icon: Footprints
    },
    {
        value: true,
        label: 'Phụ kiện',
        icon: Wallet
    }
]

const ProductTable = ({
    products,
    brands,
    categories,
    total,
    page,
    limit,
    setPage,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    hasAddPermission,
    hasUpdateInfoPermission,
    hasUpdatePricePermission,
    hasDeletePermission,
    onViewProduct,
    onUpdateProductInfo,
    onUpdateProductPrice,
    getCsvProductsQuery,
    deleteProductMutation
}: ProductTableProps) => {
    const columns: ColumnDef<IRootProduct>[] = [
        {
            accessorKey: 'rootProductId',
            header: () => <div className="text-center">Mã sản phẩm</div>,
            cell: ({ row }) => <div>{row.original.rootProductId}</div>
        },
        {
            accessorKey: 'images',
            header: () => <div>Ảnh sản phẩm</div>,
            cell: ({ row }) => (
                <div className="grid w-fit grid-cols-1 gap-2 xl:grid-cols-2 2xl:grid-cols-3">
                    {(row.original.images ?? []).map((image, index) => (
                        <div
                            key={index}
                            className="border-primary flex w-[70px] items-center justify-center overflow-hidden rounded-xl border-3 p-1"
                        >
                            <img
                                src={image as string}
                                alt="product image"
                                className="aspect-square h-full w-full rounded-lg object-cover"
                            />
                        </div>
                    ))}
                </div>
            )
        },
        {
            accessorKey: 'name',
            header: () => <div>Thông tin sản phẩm</div>,
            cell: ({ row }) => (
                <div className="flex max-w-[400px] flex-col gap-2 break-words whitespace-normal">
                    <p>
                        <span className="font-semibold">Tên: </span>
                        {row.original.name}
                    </p>
                    {row.original.shoeFeature?.category && (
                        <p>
                            <span className="font-semibold">Danh mục: </span>
                            {(row.original.shoeFeature.category as IShoeCategory)?.name}
                        </p>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Giá tiền: </span>
                        {!!row.original.discountRate && row.original.discountRate > 0 ? (
                            <>
                                <Badge variant="destructive">
                                    <BadgeDollarSign /> {formatCurrency(row.original.price)}
                                </Badge>
                                <ArrowRight />
                                <Badge variant="success">
                                    <BadgeDollarSign />{' '}
                                    {formatCurrency(row.original.price * (1 - row.original.discountRate / 100))} (-
                                    {row.original.discountRate}%)
                                </Badge>
                            </>
                        ) : (
                            <Badge variant="success">
                                <BadgeDollarSign /> {formatCurrency(row.original.price)}
                            </Badge>
                        )}
                    </div>
                    {row.original.brand && (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Thương hiệu: </span>
                            <Badge variant="default">
                                <Crown /> {(row.original.brand as IProductBrand)?.name}
                            </Badge>
                        </div>
                    )}
                    <p className="line-clamp-3">
                        <span className="font-semibold">Mô tả: </span>
                        {striptags(row.original.description)}
                    </p>
                </div>
            )
        },
        {
            accessorKey: 'isAccessory',
            header: () => <div>Loại sản phẩm</div>,
            cell: ({ row }) => {
                const productType = productTypes.find(type => type.value === row.original.isAccessory)
                if (!productType) return null

                return (
                    <div className="flex items-center">
                        {productType.icon && <productType.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                        <span>{productType.label}</span>
                    </div>
                )
            }
        },
        {
            id: 'Tồn kho',
            accessorFn: row => {
                return (row.productItems ?? [{ stock: 0 }]).reduce((total, item) => total + (item.stock ?? 0), 0)
            },
            header: () => <div className="text-center">Tồn kho</div>,
            cell: ({ getValue }) => {
                const totalStock = getValue<number>()
                return (
                    <div className="flex justify-center">
                        <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
                            <ScanBarcode /> {totalStock.toString().padStart(2, '0')}
                        </Badge>
                    </div>
                )
            }
        },
        {
            accessorKey: 'createdBy',
            header: () => <div>Thông tin người tạo</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-2 break-words whitespace-normal">
                        <p>
                            <span className="font-semibold">Người tạo: </span>
                            {(row.original.createdByStaff as Partial<IStaff> | undefined)?.name}
                        </p>
                        <p>
                            <span className="font-semibold">Ngày tạo: </span>
                            {dayjs(row.original.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                        </p>
                    </div>
                )
            }
        },
        {
            id: 'actions',
            header: () => <div className="text-center">Hành động</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                                <MoreHorizontal />
                                <span className="sr-only">Mở menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-[160px]">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewProduct(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={!hasUpdateInfoPermission}
                                className="cursor-pointer"
                                onClick={() => {
                                    if (hasUpdateInfoPermission) {
                                        onUpdateProductInfo(row.original)
                                    }
                                }}
                            >
                                Chỉnh sửa thông tin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={!hasUpdatePricePermission}
                                className="cursor-pointer"
                                onClick={() => {
                                    if (hasUpdatePricePermission) {
                                        onUpdateProductPrice(row.original)
                                    }
                                }}
                            >
                                Thay đổi giá bán
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmationDialog
                                title="Bạn có chắc muốn xóa vai trò này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn vai trò khỏi hệ thống NHT Marine."
                                onConfirm={async () => {
                                    if (hasDeletePermission) {
                                        deleteProductMutation.mutateAsync(row.original.rootProductId)
                                    }
                                }}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={!hasDeletePermission}
                                        className="cursor-pointer"
                                    >
                                        Xóa
                                    </DropdownMenuItem>
                                }
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ]

    const lastPage = Math.ceil(total / limit)

    return (
        <div className="flex flex-col gap-8">
            <ProductTableToolbar
                getCsvProductsQuery={getCsvProductsQuery}
                limit={limit}
                setLimit={setLimit}
                buildQuery={buildQuery}
                onFilterSearch={onFilterSearch}
                onResetFilterSearch={onResetFilterSearch}
                brands={brands}
                categories={categories}
                hasAddPermission={hasAddPermission}
            />
            <DataTable columns={columns} data={products} />
            <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
    )
}

export default ProductTable
