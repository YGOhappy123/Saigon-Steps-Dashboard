import { useEffect, useState } from 'react'
import { CategorySortAndFilterParams } from '@/features/category/services/categoryService'
import { PopoverContent } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowDown10, ArrowUp10 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type CategoryFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: CategorySortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
}

const CategoryFilter = ({ setHavingFilters, onChange, onSearch, onReset }: CategoryFilterProps) => {
    const [searchName, setSearchName] = useState<string>('')
    const [sort, setSort] = useState<string>('-categoryId')

    useEffect(() => {
        const appliedFilters: CategorySortAndFilterParams = {
            searchName: searchName,
            sort: sort
        }

        onChange(appliedFilters)
    }, [searchName, sort])

    const handleSearch = () => {
        onSearch()

        const isChanged = searchName !== '' || sort !== '-categoryId'
        setHavingFilters(isChanged)
    }

    const handleReset = () => {
        setSearchName('')
        setSort('-categoryId')

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
                    placeholder="Lọc theo tên danh mục..."
                    className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                />

                <Select value={sort} onValueChange={value => setSort(value)}>
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[
                            { value: '-categoryId', label: 'Xếp theo mã danh mục giảm dần', Icon: ArrowDown10 },
                            { value: '+categoryId', label: 'Xếp theo mã danh mục tăng dần', Icon: ArrowUp10 }
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

export default CategoryFilter
