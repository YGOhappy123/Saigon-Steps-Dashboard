import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

export type CustomerSortAndFilterParams = {
    searchName: string
    searchEmail: string
    searchIsActive: boolean | undefined
    searchRange: string[] | any[] | undefined
    sort: string
}

const customerService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [customers, setCustomers] = useState<ICustomer[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')

    const buildQuery = ({
        searchName,
        searchEmail,
        searchIsActive,
        searchRange,
        sort
    }: CustomerSortAndFilterParams) => {
        const query: any = {}
        if (searchName) query.name = searchName.trim()
        if (searchEmail) query.email = searchEmail.trim()
        if (searchIsActive != null) query.isActive = searchIsActive
        if (searchRange) {
            if (searchRange[0]) query.startTime = dayjs(searchRange[0]).format('YYYY-MM-DD')
            if (searchRange[1]) query.endTime = dayjs(searchRange[1]).format('YYYY-MM-DD')
        }

        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const getAllCustomersQuery = useQuery({
        queryKey: ['customers', page, limit],
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<ICustomer[]>>(`/customers?skip=${limit * (page - 1)}&limit=${limit}`)
            }
        },
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000
    })

    useEffect(() => {
        if (getAllCustomersQuery.isSuccess && getAllCustomersQuery.data && !isSearching) {
            setCustomers(getAllCustomersQuery.data.data?.data)
            setTotal(getAllCustomersQuery.data.data?.total as number)
        }
    }, [getAllCustomersQuery.isSuccess, getAllCustomersQuery.data])

    const searchCustomersQuery = useQuery({
        queryKey: ['search-customers', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<ICustomer[]>>(
                `/customers?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`
            )
        },
        enabled: false
    })

    useEffect(() => {
        if (searchCustomersQuery.isSuccess && searchCustomersQuery.data) {
            setCustomers(searchCustomersQuery.data.data?.data)
            setTotal(searchCustomersQuery.data.data?.total as number)
        }
    }, [searchCustomersQuery.isSuccess, searchCustomersQuery.data])

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchCustomersQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllCustomersQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchCustomersQuery.refetch()
        }
    }, [page, limit])

    const getCsvCustomersQuery = useQuery({
        queryKey: ['csv-customers', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<ICustomer[]>>(`/guests?filter=${query}&sort=${sort}`)
        },
        enabled: false
    })

    const deactivateCustomerMutation = useMutation({
        mutationFn: (customerId: number) => {
            return axios.post<IResponseData<any>>(`/customers/${customerId}/deactivate-account`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-customers'] })
                searchCustomersQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['customers'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        customers,
        total,
        page,
        limit,
        setPage,
        setLimit,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        getCsvCustomersQuery,
        deactivateCustomerMutation
    }
}

export default customerService
