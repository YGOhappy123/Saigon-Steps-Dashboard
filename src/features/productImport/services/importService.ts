import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'
import dayjs from '@/libs/dayjs'

export type ImportSortAndFilterParams = {
    searchInvoice: string
    searchMinCost: string
    searchMaxCost: string
    searchRange: string[] | any[] | undefined
    sort: string
}

export type CreateImportDto = {
    brandId: number
    invoice: string
    description: string
    price: number
    isAccessory: boolean
    images: string[]
    sizes?: string[]
    features?: Partial<IShoeFeature>
}

export type UpdateImportInfoDto = Omit<CreateImportDto, 'isAccessory' | 'price' | 'sizes'>

const importService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [imports, setImports] = useState<IProductImport[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState<string>('{}')
    const [sort, setSort] = useState<string>('{}')

    const buildQuery = ({
        searchInvoice,
        searchMinCost,
        searchMaxCost,
        searchRange,
        sort
    }: ImportSortAndFilterParams) => {
        const query: any = {}
        if (searchInvoice) query.invoiceNumber = searchInvoice.trim()
        if (searchMinCost) query.minCost = Number(searchMinCost)
        if (searchMaxCost) query.maxCost = Number(searchMaxCost)
        if (searchRange) {
            if (searchRange[0]) query.startImportDate = dayjs(searchRange[0]).format('YYYY-MM-DD')
            if (searchRange[1]) query.endImportDate = dayjs(searchRange[1]).format('YYYY-MM-DD')
        }

        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const getAllImportsQuery = useQuery({
        queryKey: ['imports', page, limit],
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IProductImport[]>>(
                    `/reports/imports?skip=${limit * (page - 1)}&limit=${limit}&sort=${JSON.stringify({ importId: 'desc' })}`
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
        if (getAllImportsQuery.isSuccess && getAllImportsQuery.data && !isSearching) {
            setImports(getAllImportsQuery.data.data?.data)
            setTotal(getAllImportsQuery.data.data?.total as number)
        }
    }, [getAllImportsQuery.isSuccess, getAllImportsQuery.data])

    const searchImportsQuery = useQuery({
        queryKey: ['search-imports', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IProductImport[]>>(
                `/reports/imports?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`
            )
        },
        enabled: false
    })

    useEffect(() => {
        if (searchImportsQuery.isSuccess && searchImportsQuery.data) {
            setImports(searchImportsQuery.data.data?.data)
            setTotal(searchImportsQuery.data.data?.total as number)
        }
    }, [searchImportsQuery.isSuccess, searchImportsQuery.data])

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchImportsQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllImportsQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchImportsQuery.refetch()
        }
    }, [page, limit])

    const getCsvImportsQuery = useQuery({
        queryKey: ['csv-imports', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IProductImport[]>>(`/reports/imports?filter=${query}&sort=${sort}`)
        },
        enabled: false
    })

    const addNewImportMutation = useMutation({
        mutationFn: (data: CreateImportDto) => axios.post<IResponseData<any>>('/reports/imports', data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-imports'] })
                searchImportsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['imports'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        imports,
        total,
        page,
        limit,
        setPage,
        setLimit,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        getCsvImportsQuery,
        addNewImportMutation
    }
}

export default importService
