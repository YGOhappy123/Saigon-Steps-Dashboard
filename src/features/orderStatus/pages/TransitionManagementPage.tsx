import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Avatar as RadixAvatar, AvatarImage as RadixAvatarImage } from '@radix-ui/react-avatar'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import transitionService, { TransitionGroup } from '@/features/orderStatus/services/transitionService'
import TransitionGrid from '@/features/orderStatus/components/TransitionGrid'
import AddTransitionDialog from '@/features/orderStatus/components/AddTransitionDialog'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'
import useAxiosIns from '@/hooks/useAxiosIns'

const TransitionManagementPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<IOrderStatus | null>(null)
    const transitionServiceData = transitionService({ enableFetching: true })

    const fetchAllOrderStatusesQuery = useQuery({
        queryKey: ['order-statuses-all'],
        queryFn: () => axios.get<IResponseData<IOrderStatus[]>>('/order-statuses'),
        enabled: true,
        select: res => res.data
    })
    const orderStatuses = fetchAllOrderStatusesQuery.data?.data || []

    const getSelectedStatusIds = (statusId: number | undefined, transitionGroups: TransitionGroup[]) => {
        const matchingGroup = transitionGroups.find(group => group.fromStatusId === statusId)
        if (!matchingGroup) return []

        return matchingGroup.transitions.map(trans => trans.toStatusId!)
    }

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">
                        Đây là danh sách hướng chuyển trạng thái đơn hàng của hệ thống Saigon Steps.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <AddTransitionDialog
                fromStatus={selectedStatus}
                availableStatuses={orderStatuses.filter(
                    item =>
                        item.statusId !== selectedStatus?.statusId &&
                        !getSelectedStatusIds(selectedStatus?.statusId, transitionServiceData.transitions).includes(
                            item.statusId
                        )
                )}
                open={addDialogOpen}
                setOpen={setAddDialogOpen}
                addNewTransitionMutation={transitionServiceData.addNewTransitionMutation}
            />

            {orderStatuses.length === 0 && (
                <div className="col-span-2 flex flex-1 flex-col items-center justify-center gap-2 py-20">
                    <RadixAvatar className="w-[30%] xl:w-[20%]">
                        <RadixAvatarImage src="/images/happy-emoji.png" alt="empty cart"></RadixAvatarImage>
                    </RadixAvatar>
                    <p className="mt-2 text-center font-semibold">Không có trạng thái</p>
                    <p className="text-center font-semibold">
                        Hệ thống Saigon Steps không tìm thấy trạng thái đơn hàng nào!
                    </p>
                </div>
            )}

            {orderStatuses.length > 0 && (
                <TransitionGrid
                    orderStatuses={orderStatuses}
                    statusTransitions={transitionServiceData.transitions}
                    hasAddPermission={verifyPermission(user, appPermissions.addNewTransition)}
                    hasDeletePermission={verifyPermission(user, appPermissions.deleteTransition)}
                    onAddTransition={(status: IOrderStatus) => {
                        setSelectedStatus(status)
                        setAddDialogOpen(true)
                    }}
                    deleteTransitionMutation={transitionServiceData.deleteTransitionMutation}
                />
            )}
        </div>
    )
}

export default TransitionManagementPage
