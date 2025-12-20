import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'
import dayjs from '@/libs/dayjs'

export type PromotionSortAndFilterParams = {
    searchName: string
    searchProducts: number[]
    searchIsActive: boolean | undefined
    searchRange: string[] | any[] | undefined
    searchApplyRange: string[] | any[] | undefined
    sort: string
}

const promotionService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [promotions, setPromotions] = useState<IPromotion[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState<string>('{}')
    const [sort, setSort] = useState<string>('{}')

    const buildQuery = ({
        searchName,
        searchProducts,
        searchIsActive,
        searchRange,
        searchApplyRange,
        sort
    }: PromotionSortAndFilterParams) => {
        const query: any = {}
        if (searchName) query.name = searchName.trim()
        if (searchProducts.length > 0) query.products = searchProducts
        if (searchIsActive != null) query.isAvailable = searchIsActive
        if (searchRange) {
            if (searchRange[0]) query.startTime = dayjs(searchRange[0]).format('YYYY-MM-DD')
            if (searchRange[1]) query.endTime = dayjs(searchRange[1]).format('YYYY-MM-DD')
        }
        if (searchApplyRange) {
            if (searchApplyRange[0]) query.startApplyTime = dayjs(searchApplyRange[0]).format('YYYY-MM-DD')
            if (searchApplyRange[1]) query.endApplyTime = dayjs(searchApplyRange[1]).format('YYYY-MM-DD')
        }

        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const getAllPromotionsQuery = useQuery({
        queryKey: ['promotions', page, limit],
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IPromotion[]>>(
                    `/promotions?skip=${limit * (page - 1)}&limit=${limit}&sort=${JSON.stringify({ promotionId: 'desc' })}`
                )
            }
            return null
        },
        enabled: enableFetching,
        refetchIntervalInBackground: true,
        refetchInterval: 30000
    })

    useEffect(() => {
        if (getAllPromotionsQuery.isSuccess && getAllPromotionsQuery.data && !isSearching) {
            setPromotions(getAllPromotionsQuery.data.data?.data)
            setTotal(getAllPromotionsQuery.data.data?.total as number)
        }
    }, [getAllPromotionsQuery.isSuccess, getAllPromotionsQuery.data])

    const searchPromotionsQuery = useQuery({
        queryKey: ['search-promotions', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IPromotion[]>>(
                `/promotions?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`
            )
        },
        enabled: false
    })

    useEffect(() => {
        if (searchPromotionsQuery.isSuccess && searchPromotionsQuery.data) {
            setPromotions(searchPromotionsQuery.data.data?.data)
            setTotal(searchPromotionsQuery.data.data?.total as number)
        }
    }, [searchPromotionsQuery.isSuccess, searchPromotionsQuery.data])

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchPromotionsQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllPromotionsQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchPromotionsQuery.refetch()
        }
    }, [page, limit])

    const getCsvPromotionsQuery = useQuery({
        queryKey: ['csv-promotions', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IPromotion[]>>(`/promotions?filter=${query}&sort=${sort}`)
        },
        enabled: false
    })

    const addNewPromotionMutation = useMutation({
        mutationFn: (data: Partial<IPromotion>) => axios.post<IResponseData<any>>('/promotions', data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-promotions'] })
                searchPromotionsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['promotions'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updatePromotionMutation = useMutation({
        mutationFn: ({ promotionId, data }: { promotionId: number; data: Partial<IPromotion> }) =>
            axios.patch<IResponseData<any>>(`/promotions/${promotionId}`, data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-promotions'] })
                searchPromotionsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['promotions'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const disablePromotionMutation = useMutation({
        mutationFn: (promotionId: number) =>
            axios.post<IResponseData<any>>(`/promotions/${promotionId}/disable-promotion`),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-promotions'] })
                searchPromotionsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['promotions'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        promotions,
        total,
        page,
        limit,
        setPage,
        setLimit,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        getCsvPromotionsQuery,
        addNewPromotionMutation,
        updatePromotionMutation,
        disablePromotionMutation
    }
}

export default promotionService
