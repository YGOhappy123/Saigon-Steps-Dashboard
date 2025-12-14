import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import SummaryCards from '@/features/statistic/components/SummaryCards'
import RevenuesChart from '@/features/statistic/components/RevenuesChart'
import KeyCustomers from '@/features/statistic/components/KeyCustomers'

export type StatisticCriteria = 'daily' | 'weekly' | 'monthly' | 'yearly'

export const statisticTypes = [
    {
        label: 'Hôm nay',
        value: 'daily'
    },
    {
        label: 'Tuần này',
        value: 'weekly'
    },
    {
        label: 'Tháng này',
        value: 'monthly'
    },
    {
        label: 'Năm nay',
        value: 'yearly'
    }
]

const RevenueStatisticPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">
                        Đây là thống kê chi tiết về tình hình hoạt động và khách hàng tiêu biểu của hệ thống Saigon
                        Steps.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <div className="grid grid-cols-6 gap-6">
                <SummaryCards />
                <RevenuesChart />
                <KeyCustomers />
            </div>
        </div>
    )
}

export default RevenueStatisticPage
