import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import CustomerTable from '@/features/customer/components/CustomerTable'
import SendMessageDialog from '@/features/customer/components/SendMessageDialog'
import customerService from '@/features/customer/services/customerService'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'

const CustomerListPage = () => {
    const user = useSelector((state: RootState) => state.auth.user!)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null)
    const customerServiceData = customerService({ enableFetching: true })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user.name}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách khách hàng của hệ thống Saigon Steps.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user.avatar} alt={user.name} />
                    </Avatar>
                </div>
            </div>

            <SendMessageDialog customer={selectedCustomer} open={dialogOpen} setOpen={setDialogOpen} />

            <CustomerTable
                customers={customerServiceData.customers}
                total={customerServiceData.total}
                page={customerServiceData.page}
                limit={customerServiceData.limit}
                setPage={customerServiceData.setPage}
                setLimit={customerServiceData.setLimit}
                buildQuery={customerServiceData.buildQuery}
                onFilterSearch={customerServiceData.onFilterSearch}
                onResetFilterSearch={customerServiceData.onResetFilterSearch}
                hasSendMessagePermission={verifyPermission(user, appPermissions.chatWithCustomer)}
                hasDeactivateCustomerPermission={verifyPermission(user, appPermissions.deactivateCustomerAccount)}
                onSendMessage={(customer: ICustomer) => {
                    setSelectedCustomer(customer)
                    setDialogOpen(true)
                }}
                getCsvCustomersQuery={customerServiceData.getCsvCustomersQuery}
                deactivateCustomerMutation={customerServiceData.deactivateCustomerMutation}
            />
        </div>
    )
}

export default CustomerListPage
