import { useEffect, useState } from 'react'
import { CustomerSortAndFilterParams } from '@/features/customer/services/customerService'
import { DateRange } from 'react-day-picker'
import { PopoverContent } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowDown10, ArrowUp10, CircleCheck, CircleUser, CircleX } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import DateRangePicker from '@/components/common/DateRangePicker'

type CustomerFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: CustomerSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
}

const CustomerFilter = ({ setHavingFilters, onChange, onSearch, onReset }: CustomerFilterProps) => {
    const [searchName, setSearchName] = useState<string>('')
    const [searchEmail, setSearchEmail] = useState<string>('')
    const [searchIsActive, setSearchIsActive] = useState<boolean | undefined>(undefined)
    const [searchRange, setSearchRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-createdAt')

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
        const appliedFilters: CustomerSortAndFilterParams = {
            searchName: searchName,
            searchEmail: searchEmail,
            searchIsActive: searchIsActive,
            searchRange: searchRange,
            sort: sort
        }

        onChange(appliedFilters)
    }, [searchName, searchEmail, searchIsActive, searchRange, sort])

    const handleSearch = () => {
        onSearch()

        const isChanged =
            searchName !== '' ||
            searchEmail !== '' ||
            searchIsActive !== null ||
            (searchRange && searchRange.length > 0) ||
            sort !== '-createdAt'
        setHavingFilters(isChanged)
    }

    const handleReset = () => {
        setSearchName('')
        setSearchEmail('')
        setSearchIsActive(undefined)
        setSearchRange([])
        setSort('-createdAt')
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

                <Input
                    name="email"
                    placeholder="Lọc theo email..."
                    className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                    value={searchEmail}
                    onChange={e => setSearchEmail(e.target.value)}
                />

                <DateRangePicker date={date} setDate={setDate} triggerClassName="text-card-foreground h-10 text-sm" />

                <Select
                    value={searchIsActive === undefined ? 'undefined' : searchIsActive.toString()}
                    onValueChange={value =>
                        setSearchIsActive(value === 'true' ? true : value === 'false' ? false : undefined)
                    }
                >
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[
                            { value: 'undefined', label: 'Lọc theo trạng thái: Tất cả', Icon: CircleUser },
                            { value: 'true', label: 'Lọc theo trạng thái: Đang hoạt động', Icon: CircleCheck },
                            { value: 'false', label: 'Lọc theo trạng thái: Đã bị khóa', Icon: CircleX }
                        ].map(sortOption => (
                            <SelectItem key={sortOption.value} value={sortOption.value}>
                                <sortOption.Icon /> {sortOption.label}
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
                            { value: '-createdAt', label: 'Xếp theo ngày đăng ký giảm dần', Icon: ArrowDown10 },
                            { value: '+createdAt', label: 'Xếp theo ngày đăng ký tăng dần', Icon: ArrowUp10 }
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

export default CustomerFilter
