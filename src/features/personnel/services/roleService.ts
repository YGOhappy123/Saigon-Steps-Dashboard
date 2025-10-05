import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

export type RoleSortAndFilterParams = {
    searchName: string
    searchPermissions: number[]
    searchIsImmutable: boolean | undefined
    sort: string
}

const roleService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [roles, setRoles] = useState<IStaffRole[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState<string>('{}')
    const [sort, setSort] = useState<string>('{}')

    const buildQuery = ({ searchName, searchPermissions, searchIsImmutable, sort }: RoleSortAndFilterParams) => {
        const query: any = {}
        if (searchName) query.name = searchName.trim()
        if (searchPermissions.length > 0) query.permissions = searchPermissions
        if (searchIsImmutable != null) query.isImmutable = searchIsImmutable

        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const getAllRolesQuery = useQuery({
        queryKey: ['roles', page, limit],
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IStaffRole[]>>(
                    `/roles?skip=${limit * (page - 1)}&limit=${limit}&sort=${JSON.stringify({ roleId: 'desc' })}`
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
        if (getAllRolesQuery.isSuccess && getAllRolesQuery.data && !isSearching) {
            setRoles(getAllRolesQuery.data.data?.data)
            setTotal(getAllRolesQuery.data.data?.total as number)
        }
    }, [getAllRolesQuery.isSuccess, getAllRolesQuery.data])

    const searchRolesQuery = useQuery({
        queryKey: ['search-roles', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IStaffRole[]>>(
                `/roles?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`
            )
        },
        enabled: false
    })

    useEffect(() => {
        if (searchRolesQuery.isSuccess && searchRolesQuery.data) {
            setRoles(searchRolesQuery.data.data?.data)
            setTotal(searchRolesQuery.data.data?.total as number)
        }
    }, [searchRolesQuery.isSuccess, searchRolesQuery.data])

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchRolesQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllRolesQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchRolesQuery.refetch()
        }
    }, [page, limit])

    const getCsvRolesQuery = useQuery({
        queryKey: ['csv-roles', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IStaffRole[]>>(`/roles?filter=${query}&sort=${sort}`)
        },
        enabled: false
    })

    const addNewRoleMutation = useMutation({
        mutationFn: (data: Partial<IStaffRole>) => axios.post<IResponseData<any>>('/roles', data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-roles'] })
                searchRolesQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['roles'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateRoleMutation = useMutation({
        mutationFn: ({ roleId, data }: { roleId: number; data: Partial<IStaffRole> }) =>
            axios.patch<IResponseData<any>>(`/roles/${roleId}`, data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-roles'] })
                searchRolesQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['roles'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const removeRoleMutation = useMutation({
        mutationFn: (roleId: number) => axios.delete<IResponseData<any>>(`/roles/${roleId}`),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-roles'] })
                searchRolesQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['roles'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        roles,
        total,
        page,
        limit,
        setPage,
        setLimit,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        getCsvRolesQuery,
        addNewRoleMutation,
        updateRoleMutation,
        removeRoleMutation
    }
}

export default roleService
