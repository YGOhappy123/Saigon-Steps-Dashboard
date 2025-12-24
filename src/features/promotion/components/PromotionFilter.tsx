import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { PromotionSortAndFilterParams } from '@/features/promotion/services/promotionService'
import { PopoverContent } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowDown10, ArrowUp10, CircleCheck, CircleStar, CircleX } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import DateRangePicker from '@/components/common/DateRangePicker'

type PromotionFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: PromotionSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
    products: IRootProduct[]
}

const PromotionFilter = ({ setHavingFilters, onChange, onSearch, onReset, products }: PromotionFilterProps) => {
    const [searchName, setSearchName] = useState<string>('')
    const [searchProducts, setSearchProducts] = useState<number[]>([])
    const [searchIsActive, setSearchIsActive] = useState<boolean | undefined>(undefined)
    const [searchRange, setSearchRange] = useState<string[] | any[]>()
    const [searchApplyRange, setSearchApplyRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-promotionId')

    const [createDate, setCreateDate] = useState<DateRange | undefined>(undefined)
    useEffect(() => {
        if (createDate) {
            const createDateRange = [createDate.from]
            if (createDate.to) createDateRange.push(createDate.to)

            setSearchRange(createDateRange)
        } else {
            setSearchRange([])
        }
    }, [createDate])

    const [applyDate, setApplyDate] = useState<DateRange | undefined>(undefined)
    useEffect(() => {
        if (applyDate) {
            const applyDateRange = [applyDate.from]
            if (applyDate.to) applyDateRange.push(applyDate.to)

            setSearchApplyRange(applyDateRange)
        } else {
            setSearchApplyRange([])
        }
    }, [applyDate])

    useEffect(() => {
        const appliedFilters: PromotionSortAndFilterParams = {
            searchName: searchName,
            searchProducts: searchProducts,
            searchIsActive: searchIsActive,
            searchRange: searchRange,
            searchApplyRange: searchApplyRange,
            sort: sort
        }

        onChange(appliedFilters)
    }, [searchName, searchProducts, searchIsActive, searchRange, searchApplyRange, sort])

    const handleSearch = () => {
        onSearch()

        const isChanged =
            searchName !== '' ||
            searchProducts.length > 0 ||
            searchIsActive != null ||
            (searchRange && searchRange.length > 0) ||
            (searchApplyRange && searchApplyRange.length > 0) ||
            sort !== '-promotionId'
        setHavingFilters(isChanged)
    }

    const handleReset = () => {
        setSearchName('')
        setSearchProducts([])
        setSearchIsActive(undefined)
        setSearchRange([])
        setSearchApplyRange([])
        setSort('-promotionId')
        setCreateDate(undefined)
        setApplyDate(undefined)

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
                    placeholder="Lọc theo tên vai trò..."
                    className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                />

                <div className="border-primary relative rounded border-2 py-2 pr-1 pl-3">
                    <h3 className="text-primary bg-popover absolute -top-0.5 -left-2 -translate-y-1/2 scale-[0.8] px-1 font-medium">
                        Lọc theo sản phẩm
                    </h3>
                    <div className="mt-2 flex max-h-[150px] flex-col gap-2 overflow-y-auto pr-2">
                        {products.map(product => (
                            <div key={product.rootProductId} className="flex items-center gap-3">
                                <Checkbox
                                    checked={searchProducts.includes(product.rootProductId)}
                                    onCheckedChange={checked => {
                                        setSearchProducts(prev => {
                                            if (checked) {
                                                return [...prev, product.rootProductId].sort()
                                            } else {
                                                return prev.filter(ft => ft !== product.rootProductId)
                                            }
                                        })
                                    }}
                                    className="cursor-pointer"
                                />
                                <p className="flex-1 truncate text-sm">{product.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <DateRangePicker
                    date={createDate}
                    setDate={setCreateDate}
                    placeHolder="Lọc theo ngày tạo..."
                    triggerClassName="text-card-foreground h-10 text-sm"
                />

                <DateRangePicker
                    date={applyDate}
                    setDate={setApplyDate}
                    placeHolder="Lọc theo vùng áp dụng..."
                    triggerClassName="text-card-foreground h-10 text-sm"
                />

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
                            { value: '-promotionId', label: 'Xếp theo mã khuyễn mãi giảm dần', Icon: ArrowDown10 },
                            { value: '+promotionId', label: 'Xếp theo mã khuyễn mãi tăng dần', Icon: ArrowUp10 },
                            { value: '-discountRate', label: 'Xếp theo phần trăm giảm dần', Icon: ArrowDown10 },
                            { value: '+discountRate', label: 'Xếp theo phần trăm tăng dần', Icon: ArrowUp10 }
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

export default PromotionFilter
