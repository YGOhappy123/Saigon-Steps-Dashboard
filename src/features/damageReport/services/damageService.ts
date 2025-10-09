import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'
import dayjs from '@/libs/dayjs'

export type DamageSortAndFilterParams = {
    searchReason: InventoryDamageReason | undefined
    searchMinCost: string
    searchMaxCost: string
    searchRange: string[] | any[] | undefined
    sort: string
}

export type CreateDamageDto = {
    reason: InventoryDamageReason
    note?: string
    items: {
        productItemId: number
        expectedCost: number
        quantity: number
    }[]
}

const damageService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [damages, setDamages] = useState<IInventoryDamageReport[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState<string>('{}')
    const [sort, setSort] = useState<string>('{}')

    const buildQuery = ({
        searchReason,
        searchMinCost,
        searchMaxCost,
        searchRange,
        sort
    }: DamageSortAndFilterParams) => {
        const query: any = {}
        if (searchReason) query.reason = searchReason
        if (searchMinCost) query.minTotalExpectedCost = Number(searchMinCost)
        if (searchMaxCost) query.maxTotalExpectedCost = Number(searchMaxCost)
        if (searchRange) {
            if (searchRange[0]) query.startReportedTime = dayjs(searchRange[0]).format('YYYY-MM-DD')
            if (searchRange[1]) query.endReportedTime = dayjs(searchRange[1]).format('YYYY-MM-DD')
        }

        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const getAllDamagesQuery = useQuery({
        queryKey: ['damages', page, limit],
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IInventoryDamageReport[]>>(
                    `/reports/damages?skip=${limit * (page - 1)}&limit=${limit}&sort=${JSON.stringify({ reportId: 'desc' })}`
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
        if (getAllDamagesQuery.isSuccess && getAllDamagesQuery.data && !isSearching) {
            setDamages(getAllDamagesQuery.data.data?.data)
            setTotal(getAllDamagesQuery.data.data?.total as number)
        }
    }, [getAllDamagesQuery.isSuccess, getAllDamagesQuery.data])

    const searchDamagesQuery = useQuery({
        queryKey: ['search-damages', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IInventoryDamageReport[]>>(
                `/reports/damages?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`
            )
        },
        enabled: false
    })

    useEffect(() => {
        if (searchDamagesQuery.isSuccess && searchDamagesQuery.data) {
            setDamages(searchDamagesQuery.data.data?.data)
            setTotal(searchDamagesQuery.data.data?.total as number)
        }
    }, [searchDamagesQuery.isSuccess, searchDamagesQuery.data])

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchDamagesQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllDamagesQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchDamagesQuery.refetch()
        }
    }, [page, limit])

    const getCsvDamagesQuery = useQuery({
        queryKey: ['csv-damages', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IInventoryDamageReport[]>>(`/reports/damages?filter=${query}&sort=${sort}`)
        },
        enabled: false
    })

    const reportNewDamageMutation = useMutation({
        mutationFn: (data: CreateDamageDto) => axios.post<IResponseData<any>>('/reports/damages', data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-damages'] })
                searchDamagesQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['damages'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        damages,
        total,
        page,
        limit,
        setPage,
        setLimit,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        getCsvDamagesQuery,
        reportNewDamageMutation
    }
}

export default damageService
