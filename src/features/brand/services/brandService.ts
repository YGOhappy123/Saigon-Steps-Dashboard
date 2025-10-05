import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

export type BrandSortAndFilterParams = {
    searchName: string
    sort: string
}

const brandService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [brands, setBrands] = useState<IProductBrand[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState<string>('{}')
    const [sort, setSort] = useState<string>('{}')

    const buildQuery = ({ searchName, sort }: BrandSortAndFilterParams) => {
        const query: any = {}
        if (searchName) query.name = searchName.trim()

        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const getAllBrandsQuery = useQuery({
        queryKey: ['brands', page, limit],
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IProductBrand[]>>(
                    `/brands?skip=${limit * (page - 1)}&limit=${limit}&sort=${JSON.stringify({ brandId: 'desc' })}`
                )
            }
            return null
        },
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 30000
    })

    useEffect(() => {
        if (getAllBrandsQuery.isSuccess && getAllBrandsQuery.data && !isSearching) {
            setBrands(getAllBrandsQuery.data.data?.data)
            setTotal(getAllBrandsQuery.data.data?.total as number)
        }
    }, [getAllBrandsQuery.isSuccess, getAllBrandsQuery.data])

    const searchBrandsQuery = useQuery({
        queryKey: ['search-brands', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IProductBrand[]>>(
                `/brands?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`
            )
        },
        enabled: false
    })

    useEffect(() => {
        if (searchBrandsQuery.isSuccess && searchBrandsQuery.data) {
            setBrands(searchBrandsQuery.data.data?.data)
            setTotal(searchBrandsQuery.data.data?.total as number)
        }
    }, [searchBrandsQuery.isSuccess, searchBrandsQuery.data])

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchBrandsQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllBrandsQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchBrandsQuery.refetch()
        }
    }, [page, limit])

    const getCsvBrandsQuery = useQuery({
        queryKey: ['csv-brands', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IProductBrand[]>>(`/brands?filter=${query}&sort=${sort}`)
        },
        enabled: false
    })

    const addNewBrandMutation = useMutation({
        mutationFn: (data: Partial<IProductBrand>) => axios.post<IResponseData<any>>('/brands', data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-brands'] })
                searchBrandsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['brands'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateBrandMutation = useMutation({
        mutationFn: ({ brandId, data }: { brandId: number; data: Partial<IProductBrand> }) =>
            axios.patch<IResponseData<any>>(`/brands/${brandId}`, data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-brands'] })
                searchBrandsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['brands'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const deleteBrandMutation = useMutation({
        mutationFn: (brandId: number) => axios.delete<IResponseData<any>>(`/brands/${brandId}`),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-brands'] })
                searchBrandsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['brands'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        brands,
        total,
        page,
        limit,
        setPage,
        setLimit,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        getCsvBrandsQuery,
        addNewBrandMutation,
        updateBrandMutation,
        deleteBrandMutation
    }
}

export default brandService
