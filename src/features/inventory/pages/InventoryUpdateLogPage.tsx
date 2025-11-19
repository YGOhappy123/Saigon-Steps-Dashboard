import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import inventoryService from '@/features/inventory/services/inventoryService'
import InventoryUpdateLogTable from '@/features/inventory/components/InventoryUpdateLogTable'

const InventoryUpdateLogPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const inventoryServiceData = inventoryService({ enableFetching: true })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">Đây là lịch sử xuất nhập kho của hệ thống Saigon Steps.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <InventoryUpdateLogTable
                updateLogs={inventoryServiceData.updateLogs}
                total={inventoryServiceData.total}
                page={inventoryServiceData.page}
                limit={inventoryServiceData.limit}
                setPage={inventoryServiceData.setPage}
                setLimit={inventoryServiceData.setLimit}
                buildQuery={inventoryServiceData.buildQuery}
                onFilterSearch={inventoryServiceData.onFilterSearch}
                onResetFilterSearch={inventoryServiceData.onResetFilterSearch}
                getCsvUpdateLogsQuery={inventoryServiceData.getCsvUpdateLogsQuery}
            />
        </div>
    )
}

export default InventoryUpdateLogPage
