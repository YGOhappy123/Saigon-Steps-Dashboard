import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'
import dayjs from '@/libs/dayjs'

export type CouponSortAndFilterParams = {
    searchCode: string
    searchIsActive: boolean | undefined
    searchType: CouponType | undefined
    searchRange: string[] | any[] | undefined
    sort: string
}

const couponService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [coupons, setCoupons] = useState<ICoupon[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState<string>('{}')
    const [sort, setSort] = useState<string>('{}')

    const buildQuery = ({ searchCode, searchIsActive, searchType, searchRange, sort }: CouponSortAndFilterParams) => {
        const query: any = {}
        if (searchCode) query.code = searchCode.trim()
        if (searchIsActive != null) query.isAvailable = searchIsActive
        if (searchType) query.type = searchType
        if (searchRange) {
            if (searchRange[0]) query.startTime = dayjs(searchRange[0]).format('YYYY-MM-DD')
            if (searchRange[1]) query.endTime = dayjs(searchRange[1]).format('YYYY-MM-DD')
        }

        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const getAllCouponsQuery = useQuery({
        queryKey: ['coupons', page, limit],
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<ICoupon[]>>(
                    `/promotions/coupons?skip=${limit * (page - 1)}&limit=${limit}&sort=${JSON.stringify({ couponId: 'desc' })}`
                )
            }
            return null
        },
        enabled: enableFetching,
        refetchIntervalInBackground: true,
        refetchInterval: 30000
    })

    useEffect(() => {
        if (getAllCouponsQuery.isSuccess && getAllCouponsQuery.data && !isSearching) {
            setCoupons(getAllCouponsQuery.data.data?.data)
            setTotal(getAllCouponsQuery.data.data?.total as number)
        }
    }, [getAllCouponsQuery.isSuccess, getAllCouponsQuery.data])

    const searchCouponsQuery = useQuery({
        queryKey: ['search-coupons', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<ICoupon[]>>(
                `/promotions/coupons?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`
            )
        },
        enabled: false
    })

    useEffect(() => {
        if (searchCouponsQuery.isSuccess && searchCouponsQuery.data) {
            setCoupons(searchCouponsQuery.data.data?.data)
            setTotal(searchCouponsQuery.data.data?.total as number)
        }
    }, [searchCouponsQuery.isSuccess, searchCouponsQuery.data])

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchCouponsQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllCouponsQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchCouponsQuery.refetch()
        }
    }, [page, limit])

    const getCsvCouponsQuery = useQuery({
        queryKey: ['csv-coupons', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<ICoupon[]>>(`/promotions/coupons?filter=${query}&sort=${sort}`)
        },
        enabled: false
    })

    const addNewCouponMutation = useMutation({
        mutationFn: (data: Partial<ICoupon>) => axios.post<IResponseData<any>>('/promotions/coupons', data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-coupons'] })
                searchCouponsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['coupons'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const disableCouponMutation = useMutation({
        mutationFn: (couponId: number) =>
            axios.post<IResponseData<any>>(`/promotions/coupons/${couponId}/disable-coupon`),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-coupons'] })
                searchCouponsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['coupons'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        coupons,
        total,
        page,
        limit,
        setPage,
        setLimit,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        getCsvCouponsQuery,
        addNewCouponMutation,
        disableCouponMutation
    }
}

export default couponService
