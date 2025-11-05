import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'
import dayjs from '@/libs/dayjs'

export type OrderSortAndFilterParams = {
    searchName: string
    searchStatus: number
    searchMinPrice: string
    searchMaxPrice: string
    searchRange: string[] | any[] | undefined
    sort: string
}

const orderService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [orders, setOrders] = useState<IOrder[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState<string>('{}')
    const [sort, setSort] = useState<string>('{}')

    const buildQuery = ({
        searchName,
        searchStatus,
        searchMinPrice,
        searchMaxPrice,
        searchRange,
        sort
    }: OrderSortAndFilterParams) => {
        const query: any = {}
        if (searchName) query.customerName = searchName.trim()
        if (searchStatus) query.statusId = searchStatus
        if (searchMinPrice) query.minTotalAmount = Number(searchMinPrice)
        if (searchMaxPrice) query.maxTotalAmount = Number(searchMaxPrice)
        if (searchRange) {
            if (searchRange[0]) query.startTime = dayjs(searchRange[0]).format('YYYY-MM-DD')
            if (searchRange[1]) query.endTime = dayjs(searchRange[1]).format('YYYY-MM-DD')
        }

        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const getAllOrdersQuery = useQuery({
        queryKey: ['orders', page, limit],
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IOrder[]>>(
                    `/orders?skip=${limit * (page - 1)}&limit=${limit}&sort=${JSON.stringify({ orderId: 'desc' })}`
                )
            }
            return null
        },
        enabled: enableFetching,
        refetchIntervalInBackground: true,
        refetchInterval: 30000
    })

    useEffect(() => {
        if (getAllOrdersQuery.isSuccess && getAllOrdersQuery.data && !isSearching) {
            setOrders(getAllOrdersQuery.data.data?.data)
            setTotal(getAllOrdersQuery.data.data?.total as number)
        }
    }, [getAllOrdersQuery.isSuccess, getAllOrdersQuery.data])

    const searchOrdersQuery = useQuery({
        queryKey: ['search-orders', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IOrder[]>>(
                `/orders?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`
            )
        },
        enabled: false
    })

    useEffect(() => {
        if (searchOrdersQuery.isSuccess && searchOrdersQuery.data) {
            setOrders(searchOrdersQuery.data.data?.data)
            setTotal(searchOrdersQuery.data.data?.total as number)
        }
    }, [searchOrdersQuery.isSuccess, searchOrdersQuery.data])

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchOrdersQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllOrdersQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchOrdersQuery.refetch()
        }
    }, [page, limit])

    const getCsvOrdersQuery = useQuery({
        queryKey: ['csv-orders', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IOrder[]>>(`/orders?filter=${query}&sort=${sort}`)
        },
        enabled: false
    })

    const updateOrderStatusMutation = useMutation({
        mutationFn: ({ orderId, data }: { orderId: number; data: { statusId: number } }) =>
            axios.patch<IResponseData<any>>(`/orders/${orderId}/status`, data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-orders'] })
                searchOrdersQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['orders'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        orders,
        total,
        page,
        limit,
        setPage,
        setLimit,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        getCsvOrdersQuery,
        updateOrderStatusMutation
    }
}

export default orderService
