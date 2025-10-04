import { useState } from 'react'
import { UseQueryResult } from '@tanstack/react-query'
import { FileSpreadsheet, Funnel } from 'lucide-react'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { exportToCSV } from '@/utils/exportCsvFile'
import { CustomerSortAndFilterParams } from '@/features/customer/services/customerService'
import PageLimitSelect from '@/components/common/PageLimitSelect'
import CustomerFilter from '@/features/customer/components/CustomerFilter'
import dayjs from '@/libs/dayjs'

type CustomerTableToolbarProps = {
    limit: number
    setLimit: (limit: number) => void
    getCsvCustomersQuery: UseQueryResult<any, any>
    buildQuery: (params: CustomerSortAndFilterParams) => void
    onFilterSearch: () => void
    onResetFilterSearch: () => void
}

const CustomerTableToolbar = ({
    getCsvCustomersQuery,
    limit,
    setLimit,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch
}: CustomerTableToolbarProps) => {
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        getCsvCustomersQuery.refetch().then(res => {
            const csvCustomers = res.data?.data?.data ?? []
            const formattedCustomers = csvCustomers.map((customer: ICustomer) => ({
                ['Mã khách hàng']: customer.customerId,
                ['Họ và tên']: customer.name,
                ['Email']: customer.email ?? 'Chưa cập nhật',
                ['Thời gian đăng ký']: dayjs(customer.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                ['Trạng thái']: customer.isActive ? 'Đang hoạt động' : 'Đã bị khóa'
            }))

            exportToCSV(
                formattedCustomers,
                `SS_danh_sach_khach_hang_${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`,
                [{ wch: 15 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 20 }]
            )
        })
    }

    return (
        <div className="flex items-center justify-between">
            <PageLimitSelect limit={limit} setLimit={setLimit} />

            <div className="flex justify-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="relative">
                            <Funnel />
                            Lọc khách hàng
                            {havingFilters && (
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <CustomerFilter
                        setHavingFilters={setHavingFilters}
                        onChange={buildQuery}
                        onSearch={onFilterSearch}
                        onReset={onResetFilterSearch}
                    />
                </Popover>

                <Button onClick={exportCsvFile}>
                    <FileSpreadsheet /> Xuất file CSV
                </Button>
            </div>
        </div>
    )
}

export default CustomerTableToolbar
