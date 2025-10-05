import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

export type CategorySortAndFilterParams = {
    searchName: string
    sort: string
}

const categoryService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [categories, setCategories] = useState<IShoeCategory[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState<string>('{}')
    const [sort, setSort] = useState<string>('{}')

    const buildQuery = ({ searchName, sort }: CategorySortAndFilterParams) => {
        const query: any = {}
        if (searchName) query.name = searchName.trim()

        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const getAllCategoriesQuery = useQuery({
        queryKey: ['categories', page, limit],
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IShoeCategory[]>>(
                    `/categories?skip=${limit * (page - 1)}&limit=${limit}&sort=${JSON.stringify({ categoryId: 'desc' })}`
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
        if (getAllCategoriesQuery.isSuccess && getAllCategoriesQuery.data && !isSearching) {
            setCategories(getAllCategoriesQuery.data.data?.data)
            setTotal(getAllCategoriesQuery.data.data?.total as number)
        }
    }, [getAllCategoriesQuery.isSuccess, getAllCategoriesQuery.data])

    const searchCategoriesQuery = useQuery({
        queryKey: ['search-categories', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IShoeCategory[]>>(
                `/categories?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`
            )
        },
        enabled: false
    })

    useEffect(() => {
        if (searchCategoriesQuery.isSuccess && searchCategoriesQuery.data) {
            setCategories(searchCategoriesQuery.data.data?.data)
            setTotal(searchCategoriesQuery.data.data?.total as number)
        }
    }, [searchCategoriesQuery.isSuccess, searchCategoriesQuery.data])

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchCategoriesQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllCategoriesQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchCategoriesQuery.refetch()
        }
    }, [page, limit])

    const getCsvCategoriesQuery = useQuery({
        queryKey: ['csv-categories', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IShoeCategory[]>>(`/categories?filter=${query}&sort=${sort}`)
        },
        enabled: false
    })

    const addNewCategoryMutation = useMutation({
        mutationFn: (data: Partial<IShoeCategory>) => axios.post<IResponseData<any>>('/categories', data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-categories'] })
                searchCategoriesQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['categories'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateCategoryMutation = useMutation({
        mutationFn: ({ categoryId, data }: { categoryId: number; data: Partial<IShoeCategory> }) =>
            axios.patch<IResponseData<any>>(`/categories/${categoryId}`, data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-categories'] })
                searchCategoriesQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['categories'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const deleteCategoryMutation = useMutation({
        mutationFn: (categoryId: number) => axios.delete<IResponseData<any>>(`/categories/${categoryId}`),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-categories'] })
                searchCategoriesQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['categories'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        categories,
        total,
        page,
        limit,
        setPage,
        setLimit,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        getCsvCategoriesQuery,
        addNewCategoryMutation,
        updateCategoryMutation,
        deleteCategoryMutation
    }
}

export default categoryService
