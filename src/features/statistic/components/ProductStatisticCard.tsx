import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { BadgeDollarSign, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatisticCriteria, statisticTypes } from '@/features/statistic/pages/RevenueStatisticPage'
import formatCurrency from '@/utils/formatCurrency'
import striptags from 'striptags'

type ProductStatisticCardProps = {
    axios: AxiosInstance
    product: IRootProduct
}

type SalesData = {
    [key in StatisticCriteria]: {
        totalSales: number
        totalSoldUnits: number
        totalRefundedUnits: number
        totalRefundedAmount: number
    }
}

const ProductStatisticCard = ({ axios, product }: ProductStatisticCardProps) => {
    const [type, setType] = useState<StatisticCriteria>('daily')

    const fetchProductSalesQuery = useQuery({
        queryKey: ['product-sales', product.rootProductId],
        queryFn: () => axios.get<IResponseData<SalesData>>(`/statistics/products/${product.rootProductId}`),
        enabled: true,
        select: res => res.data
    })
    const salesData = fetchProductSalesQuery.data?.data

    return (
        <Card className="col-span-6 lg:col-span-3 xl:col-span-2">
            <CardHeader className="flex items-center justify-between gap-12">
                <div className="flex flex-col justify-center gap-1">
                    <CardTitle className="text-xl">Chi tiết doanh số</CardTitle>
                    <CardDescription>Mã sản phẩm: {product.rootProductId}</CardDescription>
                </div>
                <div className="border-primary flex w-[70px] items-center justify-center overflow-hidden rounded-xl border-3 p-1">
                    <img
                        src={product.images?.[0] as string}
                        alt="product image"
                        className="aspect-square h-full w-full rounded-lg object-cover"
                    />
                </div>
            </CardHeader>

            <Separator />
            <CardContent>
                <div className="flex flex-col gap-4 break-words whitespace-normal">
                    <a
                        className="line-clamp-1 text-xl font-semibold break-words whitespace-normal"
                        href={`/san-pham/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {product.name}
                    </a>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Giá tiền: </span>
                        <Badge variant="success">
                            <BadgeDollarSign /> {formatCurrency(product.price)}
                        </Badge>
                    </div>
                    <p className="line-clamp-3">
                        <span className="font-semibold">Mô tả: </span>
                        <span className="text-muted-foreground">{striptags(product.description)}</span>
                    </p>
                    <div className="flex flex-col gap-2">
                        <span className="font-semibold">Phân loại / Kích thước: </span>
                        <div className="flex flex-wrap gap-2">
                            {(product.productItems ?? []).map(item => (
                                <div
                                    key={item.productItemId}
                                    className="flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1 select-none"
                                >
                                    <span className="font-semibold text-pink-600">{item.size}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 lg:gap-3 xl:gap-2">
                        {statisticTypes.map(button => (
                            <Button
                                key={button.value}
                                variant={type === button.value ? 'default' : 'outline'}
                                size="lg"
                                onClick={() => setType(button.value as StatisticCriteria)}
                            >
                                {button.label}
                            </Button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="font-semibold">Doanh số bán hàng: </span>
                        <div className="flex flex-col gap-1">
                            <p className="text-muted-foreground icons-center flex justify-between font-semibold">
                                <div className="flex items-center gap-1">
                                    <Sparkles size="20" /> Số lượng bán ra:
                                </div>
                                <span className="font-normal">
                                    {(salesData?.[type]?.totalSoldUnits ?? 0).toString().padStart(2, '0')}
                                </span>
                            </p>
                            <p className="text-muted-foreground icons-center flex justify-between font-semibold">
                                <div className="flex items-center gap-1">
                                    <Sparkles size="20" /> Số tiền thu về:
                                </div>
                                <span className="font-normal">
                                    {formatCurrency(salesData?.[type]?.totalSales ?? 0)}
                                </span>
                            </p>
                            <p className="text-muted-foreground icons-center flex justify-between font-semibold">
                                <div className="flex items-center gap-1">
                                    <Sparkles size="20" /> Số lượng bị hoàn trả:
                                </div>
                                <span className="font-normal">
                                    {(salesData?.[type]?.totalRefundedUnits ?? 0).toString().padStart(2, '0')}
                                </span>
                            </p>
                            <p className="text-muted-foreground icons-center flex justify-between font-semibold">
                                <div className="flex items-center gap-1">
                                    <Sparkles size="20" /> Số tiền hoàn trả:
                                </div>
                                <span className="font-normal">
                                    {formatCurrency(salesData?.[type]?.totalRefundedAmount ?? 0)}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductStatisticCard
