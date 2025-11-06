import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import StatusTable from '@/features/orderStatus/components/StatusTable'
import DataStatusDialog from '@/features/orderStatus/components/DataStatusDialog'
import statusService from '@/features/orderStatus/services/statusService'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'

const statusActions = [
    {
        name: 'shouldReserveStock',
        shorten: 'Tạm trữ kho các sản phẩm trong đơn hàng',
        label: 'Tạm trữ kho các sản phẩm trong đơn hàng, hạn chế bán quá số lượng tồn kho. Không giảm số lượng thực tế.'
    },
    {
        name: 'shouldReleaseStock',
        shorten: 'Mở khóa các sản phẩm đã tạm trữ trước đó (nếu có)',
        label: 'Mở khóa các sản phẩm đã tạm trữ trước đó (nếu có), cho phép đặt hàng lại các sản phẩm này.'
    },
    {
        name: 'shouldReduceStock',
        shorten: 'Xuất kho các sản phẩm trong đơn hàng',
        label: 'Xuất kho các sản phẩm trong đơn hàng, giảm số lượng tồn kho thực tế.'
    },
    {
        name: 'shouldIncreaseStock',
        shorten: 'Tái nhập kho các sản phẩm trong đơn hàng',
        label: 'Tái nhập kho các sản phẩm trong đơn hàng, tăng số lượng tồn kho thực tế. Áp dụng cho các đơn bị hoàn trả.'
    },
    {
        name: 'shouldMarkAsDelivered',
        shorten: 'Đánh dấu đơn hàng là đã giao thành công',
        label: 'Đánh dấu đơn hàng là đã giao thành công, ghi nhận thời gian giao hàng và tăng doanh thu cho cửa hàng.'
    },
    {
        name: 'shouldMarkAsRefunded',
        shorten: 'Đánh dấu đơn hàng là đã hoàn hàng - trả tiền',
        label: 'Đánh dấu đơn hàng là đã hoàn hàng - trả tiền, ghi nhận thời gian hoàn trả và cập nhật lại doanh thu cho cửa hàng.'
    },
    {
        name: 'shouldSendNotification',
        shorten: 'Gửi tin nhắn thông báo tự động',
        label: 'Gửi tin nhắn thông báo tự động cho khách hàng về việc cập nhật trạng thái đơn hàng.'
    }
]

const StatusManagementPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<'view' | 'update'>('view')
    const [selectedStatus, setSelectedStatus] = useState<IOrderStatus | null>(null)
    const statusServiceData = statusService({ enableFetching: true })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">
                        Đây là danh sách trạng thái đơn hàng của hệ thống Saigon Steps.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <DataStatusDialog
                status={selectedStatus}
                mode={dialogMode}
                setMode={setDialogMode}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updateStatusMutation={statusServiceData.updateStatusMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateOrderStatus)}
                statusActions={statusActions}
            />

            <StatusTable
                statuses={statusServiceData.statuses}
                statusActions={statusActions}
                total={statusServiceData.total}
                page={statusServiceData.page}
                limit={statusServiceData.limit}
                setPage={statusServiceData.setPage}
                setLimit={statusServiceData.setLimit}
                buildQuery={statusServiceData.buildQuery}
                onFilterSearch={statusServiceData.onFilterSearch}
                onResetFilterSearch={statusServiceData.onResetFilterSearch}
                hasAddPermission={verifyPermission(user, appPermissions.addNewOrderStatus)}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateOrderStatus)}
                hasDeletePermission={verifyPermission(user, appPermissions.deleteOrderStatus)}
                onViewStatus={(status: IOrderStatus) => {
                    setSelectedStatus(status)
                    setDialogMode('view')
                    setDialogOpen(true)
                }}
                onUpdateStatus={(status: IOrderStatus) => {
                    setSelectedStatus(status)
                    setDialogMode('update')
                    setDialogOpen(true)
                }}
                getCsvStatusesQuery={statusServiceData.getCsvStatusesQuery}
                addNewStatusMutation={statusServiceData.addNewStatusMutation}
                deleteStatusMutation={statusServiceData.deleteStatusMutation}
            />
        </div>
    )
}

export default StatusManagementPage
