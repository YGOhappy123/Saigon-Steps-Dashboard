import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'
import dayjs from '@/libs/dayjs'

export type ProductSortAndFilterParams = {
    searchName: string
    searchBrand: number
    searchCategory: number
    searchIsAccessory: boolean | undefined
    searchMinPrice: string
    searchMaxPrice: string
    searchInStock: boolean | undefined
    searchRange: string[] | any[] | undefined
    sort: string
}

export type CreateProductDto = {
    brandId: number
    name: string
    description: string
    price: number
    isAccessory: boolean
    images: string[]
    sizes?: string[]
    features?: Partial<IShoeFeature>
}

export type UpdateProductInfoDto = Omit<CreateProductDto, 'isAccessory' | 'price' | 'sizes'>

const productService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [products, setProducts] = useState<IRootProduct[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState<string>('{}')
    const [sort, setSort] = useState<string>('{}')

    const buildQuery = ({
        searchName,
        searchBrand,
        searchCategory,
        searchIsAccessory,
        searchMinPrice,
        searchMaxPrice,
        searchInStock,
        searchRange,
        sort
    }: ProductSortAndFilterParams) => {
        const query: any = {}
        if (searchName) query.name = searchName.trim()
        if (searchBrand) query.brandId = searchBrand
        if (searchCategory) query.categoryId = searchCategory
        if (searchIsAccessory != null) query.isAccessory = searchIsAccessory
        if (searchMinPrice) query.minPrice = Number(searchMinPrice)
        if (searchMaxPrice) query.maxPrice = Number(searchMaxPrice)
        if (searchInStock != null) query.inStock = searchInStock
        if (searchRange) {
            if (searchRange[0]) query.startTime = dayjs(searchRange[0]).format('YYYY-MM-DD')
            if (searchRange[1]) query.endTime = dayjs(searchRange[1]).format('YYYY-MM-DD')
        }

        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const getAllProductsQuery = useQuery({
        queryKey: ['products', page, limit],
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IRootProduct[]>>(
                    `/products?skip=${limit * (page - 1)}&limit=${limit}&sort=${JSON.stringify({ rootProductId: 'desc' })}`
                )
            }
            return null
        },
        enabled: enableFetching,
        refetchIntervalInBackground: true,
        refetchInterval: 30000
    })

    useEffect(() => {
        if (getAllProductsQuery.isSuccess && getAllProductsQuery.data && !isSearching) {
            setProducts(getAllProductsQuery.data.data?.data)
            setTotal(getAllProductsQuery.data.data?.total as number)
        }
    }, [getAllProductsQuery.isSuccess, getAllProductsQuery.data])

    const searchProductsQuery = useQuery({
        queryKey: ['search-products', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IRootProduct[]>>(
                `/products?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`
            )
        },
        enabled: false
    })

    useEffect(() => {
        if (searchProductsQuery.isSuccess && searchProductsQuery.data) {
            setProducts(searchProductsQuery.data.data?.data)
            setTotal(searchProductsQuery.data.data?.total as number)
        }
    }, [searchProductsQuery.isSuccess, searchProductsQuery.data])

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchProductsQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllProductsQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchProductsQuery.refetch()
        }
    }, [page, limit])

    const getCsvProductsQuery = useQuery({
        queryKey: ['csv-products', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IRootProduct[]>>(`/products?filter=${query}&sort=${sort}`)
        },
        enabled: false
    })

    const addNewProductMutation = useMutation({
        mutationFn: (data: CreateProductDto) => axios.post<IResponseData<any>>('/products', data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-products'] })
                searchProductsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['products'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateProductInfoMutation = useMutation({
        mutationFn: ({ productId, data }: { productId: number; data: UpdateProductInfoDto }) =>
            axios.patch<IResponseData<any>>(`/products/${productId}/info`, data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-products'] })
                searchProductsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['products'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateProductPriceMutation = useMutation({
        mutationFn: ({ productId, data }: { productId: number; data: { price: number } }) =>
            axios.patch<IResponseData<any>>(`/products/${productId}/price`, data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-products'] })
                searchProductsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['products'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const deleteProductMutation = useMutation({
        mutationFn: (productId: number) => axios.delete<IResponseData<any>>(`/products/${productId}`),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-products'] })
                searchProductsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['products'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        products,
        total,
        page,
        limit,
        setPage,
        setLimit,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        getCsvProductsQuery,
        addNewProductMutation,
        updateProductInfoMutation,
        updateProductPriceMutation,
        deleteProductMutation
    }
}

export default productService
