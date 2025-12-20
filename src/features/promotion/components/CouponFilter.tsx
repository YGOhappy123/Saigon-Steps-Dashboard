import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { ArrowDown10, ArrowUp10, CircleCheck, CircleStar, CircleX } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CouponSortAndFilterParams } from '@/features/promotion/services/couponService'
import { PopoverContent } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { COUPON_TYPE_OPTIONS } from '@/configs/constants'
import DateRangePicker from '@/components/common/DateRangePicker'

type CouponFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: CouponSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
}

const CouponFilter = ({ setHavingFilters, onChange, onSearch, onReset }: CouponFilterProps) => {
    const [searchCode, setSearchCode] = useState<string>('')
    const [searchIsActive, setSearchIsActive] = useState<boolean | undefined>(undefined)
    const [searchType, setSearchType] = useState<CouponType | undefined>(undefined)
    const [searchRange, setSearchRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-couponId')

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
        const appliedFilters: CouponSortAndFilterParams = {
            searchCode: searchCode,
            searchIsActive: searchIsActive,
            searchType: searchType,
            searchRange: searchRange,
            sort: sort
        }

        onChange(appliedFilters)
    }, [searchCode, searchIsActive, searchType, searchRange, sort])

    const handleSearch = () => {
        onSearch()

        const isChanged =
            searchCode !== '' ||
            searchIsActive != null ||
            searchType != null ||
            (searchRange && searchRange.length > 0) ||
            sort !== '-couponId'
        setHavingFilters(isChanged)
    }

    const handleReset = () => {
        setSearchCode('')
        setSearchIsActive(undefined)
        setSearchType(undefined)
        setSearchRange([])
        setSort('-couponId')
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
            <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
                <Input
                    name="code"
                    placeholder="Lọc theo mã code..."
                    className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                    value={searchCode}
                    onChange={e => setSearchCode(e.target.value)}
                />

                <DateRangePicker
                    date={date}
                    setDate={setDate}
                    placeHolder="Lọc theo ngày tạo..."
                    triggerClassName="text-card-foreground h-10 text-sm"
                />

                <Select
                    value={searchType === undefined ? 'undefined' : searchType}
                    onValueChange={value => setSearchType(value === 'undefined' ? undefined : (value as CouponType))}
                >
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        <SelectItem value="undefined">Lọc theo hình thức giảm: Tất cả</SelectItem>
                        {COUPON_TYPE_OPTIONS.map(typeOption => (
                            <SelectItem key={typeOption.value} value={typeOption.value}>
                                Lọc theo hình thức giảm: {typeOption.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

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
                            { value: 'undefined', label: 'Lọc theo loại: Tất cả', Icon: CircleStar },
                            { value: 'true', label: 'Lọc theo loại: Chưa bị khóa', Icon: CircleCheck },
                            { value: 'false', label: 'Lọc theo loại: Đã bị khóa', Icon: CircleX }
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
                            { value: '-couponId', label: 'Xếp theo mã phiếu giảm giá giảm dần', Icon: ArrowDown10 },
                            { value: '+couponId', label: 'Xếp theo mã phiếu giảm giá tăng dần', Icon: ArrowUp10 }
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

export default CouponFilter
