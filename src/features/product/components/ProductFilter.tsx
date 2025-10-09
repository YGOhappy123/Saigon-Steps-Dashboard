import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { ArrowDown10, ArrowUp10, CircleCheck, CircleStar, CircleX, Footprints, Wallet } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductSortAndFilterParams } from '@/features/product/services/productService'
import { PopoverContent } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import DateRangePicker from '@/components/common/DateRangePicker'

type ProductFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: ProductSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
    brands: IProductBrand[]
    categories: IShoeCategory[]
}

const ProductFilter = ({ setHavingFilters, onChange, onSearch, onReset, brands, categories }: ProductFilterProps) => {
    const [searchName, setSearchName] = useState<string>('')
    const [searchBrand, setSearchBrand] = useState<number>(0)
    const [searchCategory, setSearchCategory] = useState<number>(0)
    const [searchIsAccessory, setSearchIsAccessory] = useState<boolean | undefined>(undefined)
    const [searchMinPrice, setSearchMinPrice] = useState<string>('')
    const [searchMaxPrice, setSearchMaxPrice] = useState<string>('')
    const [searchInStock, setSearchInStock] = useState<boolean | undefined>(undefined)
    const [searchRange, setSearchRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-productId')

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
        const appliedFilters: ProductSortAndFilterParams = {
            searchName: searchName,
            searchBrand: searchBrand,
            searchCategory: searchCategory,
            searchIsAccessory: searchIsAccessory,
            searchMinPrice: searchMinPrice,
            searchMaxPrice: searchMaxPrice,
            searchInStock: searchInStock,
            searchRange: searchRange,
            sort: sort
        }

        onChange(appliedFilters)
    }, [
        searchName,
        searchBrand,
        searchCategory,
        searchIsAccessory,
        searchMinPrice,
        searchMaxPrice,
        searchInStock,
        searchRange,
        sort
    ])

    const handleSearch = () => {
        onSearch()

        const isChanged =
            searchName !== '' ||
            searchBrand !== 0 ||
            searchCategory !== 0 ||
            searchIsAccessory !== null ||
            searchMinPrice !== '' ||
            searchMaxPrice !== '' ||
            searchInStock !== null ||
            (searchRange && searchRange.length > 0) ||
            sort !== '-productId'
        setHavingFilters(isChanged)
    }

    const handleReset = () => {
        setSearchName('')
        setSearchBrand(0)
        setSearchCategory(0)
        setSearchIsAccessory(undefined)
        setSearchMinPrice('')
        setSearchMaxPrice('')
        setSearchInStock(undefined)
        setSearchRange([])
        setSort('-productId')
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
                    placeholder="Lọc theo tên sản phẩm..."
                    className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                />

                <Select value={searchBrand.toString()} onValueChange={value => setSearchBrand(parseInt(value))}>
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        <SelectItem key={0} value="0">
                            Lọc theo thương hiệu: Tất cả
                        </SelectItem>
                        {brands.map(brand => (
                            <SelectItem key={brand.brandId} value={brand.brandId.toString()}>
                                Lọc theo thương hiệu: {brand.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={searchCategory.toString()} onValueChange={value => setSearchCategory(parseInt(value))}>
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        <SelectItem key={0} value="0">
                            Lọc theo danh mục: Tất cả
                        </SelectItem>
                        {categories.map(category => (
                            <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
                                Lọc theo danh mục: {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={searchIsAccessory === undefined ? 'undefined' : searchIsAccessory.toString()}
                    onValueChange={value =>
                        setSearchIsAccessory(value === 'true' ? true : value === 'false' ? false : undefined)
                    }
                >
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[
                            { value: 'undefined', label: 'Lọc theo loại: Tất cả', Icon: CircleStar },
                            { value: 'true', label: 'Lọc theo loại: Phụ kiện', Icon: Wallet },
                            { value: 'false', label: 'Lọc theo loại: Giày / dép', Icon: Footprints }
                        ].map(sortOption => (
                            <SelectItem key={sortOption.value} value={sortOption.value}>
                                <sortOption.Icon /> {sortOption.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-2">
                    <Input
                        name="minPrice"
                        placeholder="Giá tối thiểu..."
                        className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                        type="number"
                        value={searchMinPrice}
                        onChange={e => setSearchMinPrice(e.target.value)}
                    />
                    <Input
                        name="maxPrice"
                        placeholder="Giá tối đa..."
                        className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                        type="number"
                        value={searchMaxPrice}
                        onChange={e => setSearchMaxPrice(e.target.value)}
                    />
                </div>

                <Select
                    value={searchInStock === undefined ? 'undefined' : searchInStock.toString()}
                    onValueChange={value =>
                        setSearchInStock(value === 'true' ? true : value === 'false' ? false : undefined)
                    }
                >
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[
                            { value: 'undefined', label: 'Lọc theo trạng thái: Tất cả', Icon: CircleStar },
                            { value: 'true', label: 'Lọc theo trạng thái: Còn hàng', Icon: CircleCheck },
                            { value: 'false', label: 'Lọc theo trạng thái: Hết hàng', Icon: CircleX }
                        ].map(sortOption => (
                            <SelectItem key={sortOption.value} value={sortOption.value}>
                                <sortOption.Icon /> {sortOption.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <DateRangePicker
                    date={date}
                    setDate={setDate}
                    placeHolder="Lọc theo ngày tạo..."
                    triggerClassName="text-card-foreground h-10 text-sm"
                />

                <Select value={sort} onValueChange={value => setSort(value)}>
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[
                            { value: '-productId', label: 'Xếp theo mã sản phẩm giảm dần', Icon: ArrowDown10 },
                            { value: '+productId', label: 'Xếp theo mã sản phẩm tăng dần', Icon: ArrowUp10 },
                            { value: '-price', label: 'Xếp theo giá sản phẩm giảm dần', Icon: ArrowDown10 },
                            { value: '+price', label: 'Xếp theo giá sản phẩm tăng dần', Icon: ArrowUp10 }
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

export default ProductFilter
