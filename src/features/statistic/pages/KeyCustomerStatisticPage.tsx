import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import KeyCustomersFilter from '@/features/statistic/components/KeyCustomersFilter'
import KeyCustomers from '@/features/statistic/components/KeyCustomers'

export type ReportData = {
    range: {
        from: string
        to: string
    }
    highestOrderCountCustomers: (ICustomer & { orderCount: number })[]
    highestSpendingCustomers: (ICustomer & { orderAmount: number })[]
}

const KeyCustomerStatisticPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [limit, setLimit] = useState('5')
    const [reportData, setReportData] = useState<ReportData>({
        range: { from: '', to: '' },
        highestOrderCountCustomers: [],
        highestSpendingCustomers: []
    })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">
                        Đây là thống kê chi tiết về khách hàng nổi bật của hệ thống Saigon Steps.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <KeyCustomersFilter limit={limit} setLimit={setLimit} onSuccess={setReportData} />
            <KeyCustomers limit={limit} reportData={reportData} />
        </div>
    )
}

export default KeyCustomerStatisticPage
