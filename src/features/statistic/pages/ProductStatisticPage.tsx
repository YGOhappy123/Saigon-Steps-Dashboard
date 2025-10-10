import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { RootState } from '@/store'
import StatisticCard from '@/features/statistic/components/ProductStatisticCard'
import useAxiosIns from '@/hooks/useAxiosIns'

const ProductStatisticPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)

    const fetchProductsQuery = useQuery({
        queryKey: ['all-products'],
        queryFn: () => axios.get<IResponseData<IRootProduct[]>>('/products'),
        enabled: true,
        select: res => res.data
    })
    const products = fetchProductsQuery.data?.data ?? []

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">
                        Đây là thống kê chi tiết về doanh số của từng sản phẩm của hệ thống Saigon Steps.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <div className="grid grid-cols-6 gap-6">
                {products.length === 0 && <Skeleton className="h-[200px] w-full" />}

                {products.length > 0 &&
                    products.map(product => (
                        <StatisticCard key={product.rootProductId} axios={axios} product={product} />
                    ))}
            </div>
        </div>
    )
}

export default ProductStatisticPage
