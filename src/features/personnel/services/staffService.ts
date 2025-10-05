import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'
import dayjs from '@/libs/dayjs'

export type StaffSortAndFilterParams = {
    searchName: string
    searchEmail: string
    searchRole: number
    searchIsActive: boolean | undefined
    searchRange: string[] | any[] | undefined
    sort: string
}

const staffService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [staffs, setStaffs] = useState<IStaff[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState<string>('{}')
    const [sort, setSort] = useState<string>('{}')

    const buildQuery = ({
        searchName,
        searchEmail,
        searchRole,
        searchIsActive,
        searchRange,
        sort
    }: StaffSortAndFilterParams) => {
        const query: any = {}
        if (searchName) query.name = searchName.trim()
        if (searchEmail) query.email = searchEmail.trim()
        if (searchRole) query.roleId = searchRole
        if (searchIsActive != null) query.isActive = searchIsActive
        if (searchRange) {
            if (searchRange[0]) query.startTime = dayjs(searchRange[0]).format('YYYY-MM-DD')
            if (searchRange[1]) query.endTime = dayjs(searchRange[1]).format('YYYY-MM-DD')
        }

        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const getAllStaffsQuery = useQuery({
        queryKey: ['staffs', page, limit],
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IStaff[]>>(
                    `/staffs?skip=${limit * (page - 1)}&limit=${limit}&sort=${JSON.stringify({ staffId: 'desc' })}`
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
        if (getAllStaffsQuery.isSuccess && getAllStaffsQuery.data && !isSearching) {
            setStaffs(getAllStaffsQuery.data.data?.data)
            setTotal(getAllStaffsQuery.data.data?.total as number)
        }
    }, [getAllStaffsQuery.isSuccess, getAllStaffsQuery.data])

    const searchStaffsQuery = useQuery({
        queryKey: ['search-staffs', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IStaff[]>>(
                `/staffs?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`
            )
        },
        enabled: false
    })

    useEffect(() => {
        if (searchStaffsQuery.isSuccess && searchStaffsQuery.data) {
            setStaffs(searchStaffsQuery.data.data?.data)
            setTotal(searchStaffsQuery.data.data?.total as number)
        }
    }, [searchStaffsQuery.isSuccess, searchStaffsQuery.data])

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchStaffsQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllStaffsQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchStaffsQuery.refetch()
        }
    }, [page, limit])

    const getCsvStaffsQuery = useQuery({
        queryKey: ['csv-staffs', query, sort],
        queryFn: () => {
            return axios.get<IResponseData<IStaff[]>>(`/staffs?filter=${query}&sort=${sort}`)
        },
        enabled: false
    })

    const addNewStaffMutation = useMutation({
        mutationFn: (data: Partial<IStaff>) => axios.post<IResponseData<any>>('/staffs', data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-staffs'] })
                searchStaffsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['staffs'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateStaffInfoMutation = useMutation({
        mutationFn: ({ staffId, data }: { staffId: number; data: Partial<IStaff> }) =>
            axios.patch<IResponseData<any>>(`/staffs/${staffId}/info`, data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-staffs'] })
                searchStaffsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['staffs'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const changeStaffRoleMutation = useMutation({
        mutationFn: ({ staffId, data }: { staffId: number; data: { roleId: number } }) =>
            axios.patch<IResponseData<any>>(`/staffs/${staffId}/role`, data),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-staffs'] })
                searchStaffsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['staffs'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const deactivateStaffAccountMutation = useMutation({
        mutationFn: (staffId: number) => axios.post<IResponseData<any>>(`/staffs/${staffId}/deactivate-account`),
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-staffs'] })
                searchStaffsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['staffs'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        staffs,
        total,
        page,
        limit,
        setPage,
        setLimit,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        getCsvStaffsQuery,
        addNewStaffMutation,
        updateStaffInfoMutation,
        changeStaffRoleMutation,
        deactivateStaffAccountMutation
    }
}

export default staffService
