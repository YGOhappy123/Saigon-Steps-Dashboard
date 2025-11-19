import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMappedSort } from '@/utils/apiSortMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import dayjs from '@/libs/dayjs'

export type UpdateLogsSortAndFilterParams = {
    searchType: InventoryUpdateType | undefined
    searchOrder: string
    searchImport: string
    searchDamage: string
    searchRange: string[] | any[] | undefined
    sort: string
}

const inventoryService = ({ enableFetching }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const [updateLogs, setUpdateLogs] = useState<IInventoryUpdateLog[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState<string>('{}')
    const [sort, setSort] = useState<string>('{}')

    const buildQuery = ({
        searchType,
        searchOrder,
        searchImport,
        searchDamage,
        searchRange,
        sort
    }: UpdateLogsSortAndFilterParams) => {
        const query: any = {}
        if (searchType) query.type = searchType
        if (searchOrder) query.orderId = Number(searchOrder)
        if (searchImport) query.importId = Number(searchImport)
        if (searchDamage) query.damageReportId = Number(searchDamage)
        if (searchRange) {
            if (searchRange[0]) query.startUpdatedTime = dayjs(searchRange[0]).format('YYYY-MM-DD')
            if (searchRange[1]) query.endUpdatedTime = dayjs(searchRange[1]).format('YYYY-MM-DD')
        }

        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const getAllUpdateLogsQuery = useQuery({
        queryKey: ['inventory-update-logs', page, limit],
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IInventoryUpdateLog[]>>(
                    `/reports/inventories?skip=${limit * (page - 1)}&limit=${limit}&sort=${JSON.stringify({ logId: 'desc' })}`
                )
            }
            return null
        },
        enabled: enableFetching,
        refetchIntervalInBackground: true,
        refetchInterval: 30000
    })

    useEffect(() => {
        if (getAllUpdateLogsQuery.isSuccess && getAllUpdateLogsQuery.data && !isSearching) {
            setUpdateLogs(getAllUpdateLogsQuery.data.data?.data)
            setTotal(getAllUpdateLogsQuery.data.data?.total as number)
        }
    }, [getAllUpdateLogsQuery.isSuccess, getAllUpdateLogsQuery.data])

    const searchUpdateLogsQuery = useQuery({
        queryKey: ['search-inventory-update-logs', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IInventoryUpdateLog[]>>(
                `/reports/inventories?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`
            )
        },
        enabled: false
    })

    useEffect(() => {
        if (searchUpdateLogsQuery.isSuccess && searchUpdateLogsQuery.data) {
            setUpdateLogs(searchUpdateLogsQuery.data.data?.data)
            setTotal(searchUpdateLogsQuery.data.data?.total as number)
        }
    }, [searchUpdateLogsQuery.isSuccess, searchUpdateLogsQuery.data])

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchUpdateLogsQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllUpdateLogsQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchUpdateLogsQuery.refetch()
        }
    }, [page, limit])

    const getCsvUpdateLogsQuery = useQuery({
        queryKey: ['csv-inventory-update-logs', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IInventoryUpdateLog[]>>(`/reports/inventories?filter=${query}&sort=${sort}`)
        },
        enabled: false
    })

    return {
        updateLogs,
        total,
        page,
        limit,
        setPage,
        setLimit,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        getCsvUpdateLogsQuery
    }
}

export default inventoryService
