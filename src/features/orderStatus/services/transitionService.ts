import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { onError } from '@/utils/errorsHandler'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

export type TransitionSortAndFilterParams = {
    searchFromStatus: number
    searchToStatus: number
    sort: string
}

export type TransitionGroup = {
    fromStatusId: number
    fromStatus: {
        statusId: number
        name: string
        description: string
        color: string
    }
    transitions: {
        toStatusId: number
        label: string
        isScanningRequired: boolean
        toStatus: {
            statusId: number
            name: string
            description: string
            color: string
        }
    }[]
}

const transitionService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [transitions, setTransitions] = useState<TransitionGroup[]>([])

    const getAllTransitionsQuery = useQuery({
        queryKey: ['transitions'],
        queryFn: () => {
            return axios.get<IResponseData<TransitionGroup[]>>('/order-statuses/transitions')
        },
        enabled: enableFetching,
        refetchIntervalInBackground: true,
        refetchInterval: 30000
    })

    useEffect(() => {
        if (getAllTransitionsQuery.isSuccess && getAllTransitionsQuery.data) {
            setTransitions(getAllTransitionsQuery.data.data?.data)
        }
    }, [getAllTransitionsQuery.isSuccess, getAllTransitionsQuery.data])

    const addNewTransitionMutation = useMutation({
        mutationFn: (data: Partial<IOrderStatusTransition>) =>
            axios.post<IResponseData<any>>('/order-statuses/transitions', data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['transitions'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const deleteTransitionMutation = useMutation({
        mutationFn: ({ fromStatusId, toStatusId }: { fromStatusId: number; toStatusId: number }) =>
            axios.delete<IResponseData<any>>(`/order-statuses/transitions/${fromStatusId}/${toStatusId}`),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['transitions'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        transitions,
        addNewTransitionMutation,
        deleteTransitionMutation
    }
}

export default transitionService
