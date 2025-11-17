import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { ArrowDown10, ArrowUp10 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DamageSortAndFilterParams } from '@/features/damageReport/services/damageService'
import { PopoverContent } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { INVENTORY_DAMAGE_REASON_OPTIONS } from '@/configs/constants'
import DateRangePicker from '@/components/common/DateRangePicker'

type DamageReportFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: DamageSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
}

const DamageReportFilter = ({ setHavingFilters, onChange, onSearch, onReset }: DamageReportFilterProps) => {
    const [searchReason, setSearchReason] = useState<InventoryDamageReason | undefined>(undefined)
    const [searchMinCost, setSearchMinCost] = useState<string>('')
    const [searchMaxCost, setSearchMaxCost] = useState<string>('')
    const [searchRange, setSearchRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-reportId')

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
        const appliedFilters: DamageSortAndFilterParams = {
            searchReason: searchReason,
            searchMinCost: searchMinCost,
            searchMaxCost: searchMaxCost,
            searchRange: searchRange,
            sort: sort
        }

        onChange(appliedFilters)
    }, [searchReason, searchMinCost, searchMaxCost, searchRange, sort])

    const handleSearch = () => {
        onSearch()

        const isChanged =
            searchReason !== undefined ||
            searchMinCost !== '' ||
            searchMaxCost !== '' ||
            (searchRange && searchRange.length > 0) ||
            sort !== '-reportId'
        setHavingFilters(isChanged)
    }

    const handleReset = () => {
        setSearchReason(undefined)
        setSearchMinCost('')
        setSearchMaxCost('')
        setSearchRange([])
        setSort('-reportId')
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
                <Select
                    value={searchReason === undefined ? 'undefined' : searchReason}
                    onValueChange={value =>
                        setSearchReason(value === 'undefined' ? undefined : (value as InventoryDamageReason))
                    }
                >
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        <SelectItem value="undefined">Lọc theo phân loại: Tất cả</SelectItem>
                        {INVENTORY_DAMAGE_REASON_OPTIONS.map(reasonOption => (
                            <SelectItem key={reasonOption.value} value={reasonOption.value}>
                                Lọc theo phân loại: {reasonOption.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-2">
                    <Input
                        name="minPrice"
                        placeholder="Thiệt hại tối thiểu..."
                        className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                        type="number"
                        value={searchMinCost}
                        onChange={e => setSearchMinCost(e.target.value)}
                    />
                    <Input
                        name="maxPrice"
                        placeholder="Thiệt hại tối đa..."
                        className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                        type="number"
                        value={searchMaxCost}
                        onChange={e => setSearchMaxCost(e.target.value)}
                    />
                </div>

                <DateRangePicker
                    date={date}
                    setDate={setDate}
                    placeHolder="Lọc theo ngày tạo báo cáo..."
                    triggerClassName="text-card-foreground h-10 text-sm"
                />

                <Select value={sort} onValueChange={value => setSort(value)}>
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[
                            { value: '-reportId', label: 'Xếp theo mã báo cáo giảm dần', Icon: ArrowDown10 },
                            { value: '+reportId', label: 'Xếp theo mã báo cáo tăng dần', Icon: ArrowUp10 },
                            {
                                value: '-expectedCost',
                                label: 'Xếp theo thiệt hại ước tính giảm dần',
                                Icon: ArrowDown10
                            },
                            { value: '+expectedCost', label: 'Xếp theo thiệt hại ước tính tăng dần', Icon: ArrowUp10 }
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

export default DamageReportFilter
