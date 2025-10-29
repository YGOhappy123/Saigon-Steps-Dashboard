import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import { getProductSlug } from '@/utils/getProductSlug'
import useAxiosIns from '@/hooks/useAxiosIns'
import productService from '@/features/product/services/productService'
import ProductTable from '@/features/product/components/ProductTable'
import verifyPermission from '@/utils/verifyPermission'
import permissions from '@/configs/permissions'

const ProductManagementPage = () => {
    const axios = useAxiosIns()
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.auth.user)
    const productServiceData = productService({ enableFetching: true })

    const fetchAllBrandsQuery = useQuery({
        queryKey: ['brands-all'],
        queryFn: () => axios.get<IResponseData<IProductBrand[]>>('/brands'),
        enabled: true,
        select: res => res.data
    })
    const brands = fetchAllBrandsQuery.data?.data || []

    const fetchAllCategoriesQuery = useQuery({
        queryKey: ['categories-all'],
        queryFn: () => axios.get<IResponseData<IShoeCategory[]>>('/categories'),
        enabled: true,
        select: res => res.data
    })
    const categories = fetchAllCategoriesQuery.data?.data || []

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách sản phẩm của hệ thống Saigon Steps.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <ProductTable
                products={productServiceData.products}
                brands={brands}
                categories={categories}
                total={productServiceData.total}
                page={productServiceData.page}
                limit={productServiceData.limit}
                setPage={productServiceData.setPage}
                setLimit={productServiceData.setLimit}
                buildQuery={productServiceData.buildQuery}
                onFilterSearch={productServiceData.onFilterSearch}
                onResetFilterSearch={productServiceData.onResetFilterSearch}
                hasAddPermission={verifyPermission(user, permissions.addNewProduct)}
                hasUpdateInfoPermission={verifyPermission(user, permissions.updateProductInformation)}
                hasUpdatePricePermission={verifyPermission(user, permissions.updateProductPrice)}
                hasDeletePermission={verifyPermission(user, permissions.deleteProduct)}
                onViewProduct={product => navigate(`/san-pham/${getProductSlug(product.name)}`)}
                onUpdateProductInfo={product => navigate(`/san-pham/${getProductSlug(product.name)}`)}
                onUpdateProductPrice={product => navigate(`/san-pham/${getProductSlug(product.name)}`)}
                getCsvProductsQuery={productServiceData.getCsvProductsQuery}
                deleteProductMutation={productServiceData.deleteProductMutation}
            />
        </div>
    )
}

export default ProductManagementPage
