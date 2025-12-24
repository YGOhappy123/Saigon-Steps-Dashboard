import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

export type StatusSortAndFilterParams = {
    searchName: string
    searchStatusActions: string[]
    searchIsDefault: boolean | undefined
    searchIsExplanationRequired: boolean | undefined
    sort: string
}

const statusService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [statuses, setStatuses] = useState<IOrderStatus[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState<string>('{}')
    const [sort, setSort] = useState<string>('{}')

    const buildQuery = ({
        searchName,
        searchStatusActions,
        searchIsDefault,
        searchIsExplanationRequired,
        sort
    }: StatusSortAndFilterParams) => {
        const query: any = {}
        if (searchName) query.name = searchName.trim()
        if (searchStatusActions.length > 0) query.statusActions = searchStatusActions
        if (searchIsDefault != null) query.isDefault = searchIsDefault
        if (searchIsExplanationRequired != null) query.isExplanationRequired = searchIsExplanationRequired
        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const getAllStatusesQuery = useQuery({
        queryKey: ['order-statuses', page, limit],
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IOrderStatus[]>>(
                    `/order-statuses?skip=${limit * (page - 1)}&limit=${limit}&sort=${JSON.stringify({ statusId: 'desc' })}`
                )
            }
            return null
        },
        enabled: enableFetching,
        refetchIntervalInBackground: true,
        refetchInterval: 30000
    })

    useEffect(() => {
        if (getAllStatusesQuery.isSuccess && getAllStatusesQuery.data && !isSearching) {
            setStatuses(getAllStatusesQuery.data.data?.data)
            setTotal(getAllStatusesQuery.data.data?.total as number)
        }
    }, [getAllStatusesQuery.isSuccess, getAllStatusesQuery.data])

    const searchStatusesQuery = useQuery({
        queryKey: ['search-order-statuses', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IOrderStatus[]>>(
                `/order-statuses?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`
            )
        },
        enabled: false
    })

    useEffect(() => {
        if (searchStatusesQuery.isSuccess && searchStatusesQuery.data) {
            setStatuses(searchStatusesQuery.data.data?.data)
            setTotal(searchStatusesQuery.data.data?.total as number)
        }
    }, [searchStatusesQuery.isSuccess, searchStatusesQuery.data])

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchStatusesQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllStatusesQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchStatusesQuery.refetch()
        }
    }, [page, limit])

    const getCsvStatusesQuery = useQuery({
        queryKey: ['csv-order-statuses', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IOrderStatus[]>>(`/order-statuses?filter=${query}&sort=${sort}`)
        },
        enabled: false
    })

    const addNewStatusMutation = useMutation({
        mutationFn: (data: Partial<IOrderStatus>) => axios.post<IResponseData<any>>('/order-statuses', data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-order-statuses'] })
                searchStatusesQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['order-statuses'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateStatusMutation = useMutation({
        mutationFn: ({ statusId, data }: { statusId: number; data: Partial<IOrderStatus> }) =>
            axios.patch<IResponseData<any>>(`/order-statuses/${statusId}`, data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-order-statuses'] })
                searchStatusesQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['order-statuses'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const deleteStatusMutation = useMutation({
        mutationFn: (statusId: number) => axios.delete<IResponseData<any>>(`/order-statuses/${statusId}`),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-order-statuses'] })
                searchStatusesQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['order-statuses'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        statuses,
        total,
        page,
        limit,
        setPage,
        setLimit,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        getCsvStatusesQuery,
        addNewStatusMutation,
        updateStatusMutation,
        deleteStatusMutation
    }
}

export default statusService
