import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { ArrowDown10, ArrowUp10 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImportSortAndFilterParams } from '@/features/productImport/services/importService'
import { PopoverContent } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import DateRangePicker from '@/components/common/DateRangePicker'

type ProductImportFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: ImportSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
}

const ProductImportFilter = ({ setHavingFilters, onChange, onSearch, onReset }: ProductImportFilterProps) => {
    const [searchInvoice, setSearchInvoice] = useState<string>('')
    const [searchMinCost, setSearchMinCost] = useState<string>('')
    const [searchMaxCost, setSearchMaxCost] = useState<string>('')
    const [searchRange, setSearchRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-importId')

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
        const appliedFilters: ImportSortAndFilterParams = {
            searchInvoice: searchInvoice,
            searchMinCost: searchMinCost,
            searchMaxCost: searchMaxCost,
            searchRange: searchRange,
            sort: sort
        }

        onChange(appliedFilters)
    }, [searchInvoice, searchMinCost, searchMaxCost, searchRange, sort])

    const handleSearch = () => {
        onSearch()

        const isChanged =
            searchInvoice !== '' ||
            searchMinCost !== '' ||
            searchMaxCost !== '' ||
            (searchRange && searchRange.length > 0) ||
            sort !== '-importId'
        setHavingFilters(isChanged)
    }

    const handleReset = () => {
        setSearchInvoice('')
        setSearchMinCost('')
        setSearchMaxCost('')
        setSearchRange([])
        setSort('-importId')
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
                    name="name"
                    placeholder="Lọc theo mã hóa đơn..."
                    className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                    value={searchInvoice}
                    onChange={e => setSearchInvoice(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-2">
                    <Input
                        name="minPrice"
                        placeholder="Chi phí tối thiểu..."
                        className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                        type="number"
                        value={searchMinCost}
                        onChange={e => setSearchMinCost(e.target.value)}
                    />
                    <Input
                        name="maxPrice"
                        placeholder="Chi phí tối đa..."
                        className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                        type="number"
                        value={searchMaxCost}
                        onChange={e => setSearchMaxCost(e.target.value)}
                    />
                </div>

                <DateRangePicker
                    date={date}
                    setDate={setDate}
                    placeHolder="Lọc theo ngày nhập hàng..."
                    triggerClassName="text-card-foreground h-10 text-sm"
                />

                <Select value={sort} onValueChange={value => setSort(value)}>
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[
                            { value: '-importId', label: 'Xếp theo mã đơn nhập hàng giảm dần', Icon: ArrowDown10 },
                            { value: '+importId', label: 'Xếp theo mã đơn nhập hàng tăng dần', Icon: ArrowUp10 },
                            { value: '-cost', label: 'Xếp theo tổng chi phí giảm dần', Icon: ArrowDown10 },
                            { value: '+cost', label: 'Xếp theo tổng chi phí tăng dần', Icon: ArrowUp10 }
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

export default ProductImportFilter
