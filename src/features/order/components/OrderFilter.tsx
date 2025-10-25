import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { OrderSortAndFilterParams } from '@/features/order/services/orderService'
import { PopoverContent } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowDown10, ArrowUp10 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ORDER_STATUS_OPTIONS } from '@/configs/constants'
import DateRangePicker from '@/components/common/DateRangePicker'

type OrderFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: OrderSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
}

const OrderFilter = ({ setHavingFilters, onChange, onSearch, onReset }: OrderFilterProps) => {
    const [searchName, setSearchName] = useState<string>('')
    const [searchStatus, setSearchStatus] = useState<OrderStatus | undefined>(undefined)
    const [searchMinPrice, setSearchMinPrice] = useState<string>('')
    const [searchMaxPrice, setSearchMaxPrice] = useState<string>('')
    const [searchRange, setSearchRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-orderId')

    const [date, setDate] = useState<DateRange | undefined>(undefined)
    useEffect(() => {
        if (date) {
            const dateRange = [date.from]
            if (date.to) dateRange.push(date.to)

            setSearchRange(dateRange)
        } else {
            setSearchRange([])
        }
    }, [date])

    useEffect(() => {
        const appliedFilters: OrderSortAndFilterParams = {
            searchName: searchName,
            searchStatus: searchStatus,
            searchMinPrice: searchMinPrice,
            searchMaxPrice: searchMaxPrice,
            searchRange: searchRange,
            sort: sort
        }

        onChange(appliedFilters)
    }, [searchName, searchStatus, searchMinPrice, searchMaxPrice, searchRange, sort])

    const handleSearch = () => {
        onSearch()

        const isChanged =
            searchName !== '' ||
            searchStatus != null ||
            searchMinPrice !== '' ||
            searchMaxPrice !== '' ||
            (searchRange && searchRange.length > 0) ||
            sort !== '-orderId'
        setHavingFilters(isChanged)
    }

    const handleReset = () => {
        setSearchName('')
        setSearchStatus(undefined)
        setSearchMinPrice('')
        setSearchMaxPrice('')
        setSearchRange([])
        setSort('-orderId')
        setDate(undefined)

        setHavingFilters(false)
        onReset()
    }

    return (
        <PopoverContent className="w-[400px]">
            <div className="mb-4 flex items-center justify-between">
                <Button onClick={handleSearch}>Lọc</Button>
                <Button variant="destructive" onClick={handleReset}>
                    Đặt lại
                </Button>
            </div>
            <form className="flex flex-col gap-4">
                <Input
                    name="name"
                    placeholder="Lọc theo tên khách hàng..."
                    className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                />

                <DateRangePicker
                    date={date}
                    setDate={setDate}
                    placeHolder="Lọc theo ngày đặt hàng..."
                    triggerClassName="text-card-foreground h-10 text-sm"
                />

                <div className="grid grid-cols-2 gap-2">
                    <Input
                        name="minPrice"
                        placeholder="Giá trị tối thiểu..."
                        className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                        type="number"
                        value={searchMinPrice}
                        onChange={e => setSearchMinPrice(e.target.value)}
                    />
                    <Input
                        name="maxPrice"
                        placeholder="Giá trị tối đa..."
                        className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                        type="number"
                        value={searchMaxPrice}
                        onChange={e => setSearchMaxPrice(e.target.value)}
                    />
                </div>

                <Select
                    value={searchStatus === undefined ? 'undefined' : searchStatus}
                    onValueChange={value => setSearchStatus(value === 'undefined' ? undefined : (value as OrderStatus))}
                >
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        <SelectItem value="undefined">Lọc theo trạng thái: Tất cả</SelectItem>
                        {ORDER_STATUS_OPTIONS.map(statusOption => (
                            <SelectItem key={statusOption.value} value={statusOption.value}>
                                Lọc theo trạng thái: {statusOption.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={sort} onValueChange={value => setSort(value)}>
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[
                            { value: '-orderId', label: 'Xếp theo mã đơn hàng giảm dần', Icon: ArrowDown10 },
                            { value: '+orderId', label: 'Xếp theo mã đơn hàng tăng dần', Icon: ArrowUp10 },
                            { value: '-createdAt', label: 'Xếp theo ngày đặt hàng giảm dần', Icon: ArrowDown10 },
                            { value: '+createdAt', label: 'Xếp theo ngày đặt hàng tăng dần', Icon: ArrowUp10 },
                            { value: '-amount', label: 'Xếp theo tổng giá trị đơn hàng giảm dần', Icon: ArrowDown10 },
                            { value: '+amount', label: 'Xếp theo tổng giá trị đơn hàng tăng dần', Icon: ArrowUp10 }
                        ].map(sortOption => (
                            <SelectItem key={sortOption.value} value={sortOption.value}>
                                <sortOption.Icon /> {sortOption.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </form>
        </PopoverContent>
    )
}

export default OrderFilter
