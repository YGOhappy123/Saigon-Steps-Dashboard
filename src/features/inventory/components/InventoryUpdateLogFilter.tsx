import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { ArrowDown10, ArrowUp10 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UpdateLogsSortAndFilterParams } from '@/features/inventory/services/inventoryService'
import { PopoverContent } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { INVENTORY_UPDATE_TYPE_OPTIONS } from '@/configs/constants'
import DateRangePicker from '@/components/common/DateRangePicker'

type InventoryUpdateLogFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: UpdateLogsSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
}

const InventoryUpdateLogFilter = ({ setHavingFilters, onChange, onSearch, onReset }: InventoryUpdateLogFilterProps) => {
    const [searchType, setSearchType] = useState<InventoryUpdateType | undefined>(undefined)
    const [searchOrder, setSearchOrder] = useState<string>('')
    const [searchImport, setSearchImport] = useState<string>('')
    const [searchDamage, setSearchDamage] = useState<string>('')
    const [searchRange, setSearchRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-logId')

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
        const appliedFilters: UpdateLogsSortAndFilterParams = {
            searchType: searchType,
            searchOrder: searchOrder,
            searchImport: searchImport,
            searchDamage: searchDamage,
            searchRange: searchRange,
            sort: sort
        }

        onChange(appliedFilters)
    }, [searchType, searchOrder, searchImport, searchDamage, searchRange, sort])

    const handleSearch = () => {
        onSearch()

        const isChanged =
            searchType !== undefined ||
            searchOrder !== '' ||
            searchImport !== '' ||
            searchDamage !== '' ||
            (searchRange && searchRange.length > 0) ||
            sort !== '-reportId'
        setHavingFilters(isChanged)
    }

    const handleReset = () => {
        setSearchType(undefined)
        setSearchOrder('')
        setSearchImport('')
        setSearchDamage('')
        setSearchRange([])
        setSort('-logId')
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
                    value={searchType === undefined ? 'undefined' : searchType}
                    onValueChange={value =>
                        setSearchType(value === 'undefined' ? undefined : (value as InventoryUpdateType))
                    }
                >
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        <SelectItem value="undefined">Lọc theo phân loại: Tất cả</SelectItem>
                        {INVENTORY_UPDATE_TYPE_OPTIONS.map(typeOption => (
                            <SelectItem key={typeOption.value} value={typeOption.value}>
                                Lọc theo phân loại: {typeOption.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Input
                    name="order"
                    placeholder="Mã đơn hàng..."
                    className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                    type="number"
                    value={searchOrder}
                    onChange={e => {
                        setSearchOrder(e.target.value)
                        setSearchImport('')
                        setSearchDamage('')
                    }}
                />

                <Input
                    name="import"
                    placeholder="Mã đơn nhập hàng..."
                    className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                    type="number"
                    value={searchImport}
                    onChange={e => {
                        setSearchImport(e.target.value)
                        setSearchOrder('')
                        setSearchDamage('')
                    }}
                />

                <Input
                    name="damage"
                    placeholder="Mã báo cáo thiệt hại..."
                    className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                    type="number"
                    value={searchDamage}
                    onChange={e => {
                        setSearchDamage(e.target.value)
                        setSearchOrder('')
                        setSearchImport('')
                    }}
                />

                <DateRangePicker
                    date={date}
                    setDate={setDate}
                    placeHolder="Lọc theo ngày ghi nhận..."
                    triggerClassName="text-card-foreground h-10 text-sm"
                />

                <Select value={sort} onValueChange={value => setSort(value)}>
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[
                            { value: '-logId', label: 'Xếp theo mã log giảm dần', Icon: ArrowDown10 },
                            { value: '+logId', label: 'Xếp theo mã log tăng dần', Icon: ArrowUp10 }
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

export default InventoryUpdateLogFilter
