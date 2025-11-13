import { useEffect, useState } from 'react'
import { StatusSortAndFilterParams } from '@/features/orderStatus/services/statusService'
import { PopoverContent } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowDown10, ArrowUp10, CircleCheck, CircleStar, CircleX } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

type StatusFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: StatusSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
    statusActions: {
        name: string
        label: string
        shorten: string
    }[]
}

const StatusFilter = ({ setHavingFilters, onChange, onSearch, onReset, statusActions }: StatusFilterProps) => {
    const [searchName, setSearchName] = useState<string>('')
    const [searchStatusActions, setSearchStatusActions] = useState<string[]>([])
    const [searchIsDefault, setSearchIsDefault] = useState<boolean | undefined>(undefined)
    const [sort, setSort] = useState<string>('-statusId')

    useEffect(() => {
        const appliedFilters: StatusSortAndFilterParams = {
            searchName: searchName,
            searchIsDefault: searchIsDefault,
            searchStatusActions: searchStatusActions,
            sort: sort
        }

        onChange(appliedFilters)
    }, [searchName, searchStatusActions, searchIsDefault, sort])

    const handleSearch = () => {
        onSearch()

        const isChanged =
            searchName !== '' || searchStatusActions.length > 0 || searchIsDefault !== null || sort !== '-statusId'
        setHavingFilters(isChanged)
    }

    const handleReset = () => {
        setSearchName('')
        setSearchStatusActions([])
        setSearchIsDefault(undefined)
        setSort('-statusId')

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
                    placeholder="Lọc theo tên trạng thái..."
                    className="caret-card-foreground text-card-foreground h-10 rounded border-2 font-semibold"
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                />

                <div className="border-primary relative rounded border-2 py-2 pr-1 pl-3">
                    <h3 className="text-primary bg-popover absolute -top-0.5 -left-2 -translate-y-1/2 scale-[0.8] px-1 font-medium">
                        Lọc theo danh sách tác vụ
                    </h3>
                    <div className="mt-2 flex max-h-[200px] flex-col gap-2 overflow-y-auto pr-2">
                        {statusActions.map(action => (
                            <div key={action.name} className="flex items-center gap-3">
                                <Checkbox
                                    checked={searchStatusActions.includes(action.name)}
                                    onCheckedChange={checked => {
                                        setSearchStatusActions(prev => {
                                            if (checked) {
                                                return [...prev, action.name].sort()
                                            } else {
                                                return prev.filter(ft => ft !== action.name)
                                            }
                                        })
                                    }}
                                    className="cursor-pointer"
                                />
                                <p className="flex-1 truncate text-sm">{action.shorten}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <Select
                    value={searchIsDefault === undefined ? 'undefined' : searchIsDefault.toString()}
                    onValueChange={value =>
                        setSearchIsDefault(value === 'true' ? true : value === 'false' ? false : undefined)
                    }
                >
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[
                            { value: 'undefined', label: 'Lọc theo loại: Tất cả', Icon: CircleStar },
                            { value: 'true', label: 'Lọc theo loại: Trạng thái mặc định', Icon: CircleCheck },
                            { value: 'false', label: 'Lọc theo loại: Trạng thái thông thường', Icon: CircleX }
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
                            { value: '-statusId', label: 'Xếp theo mã trạng thái giảm dần', Icon: ArrowDown10 },
                            { value: '+statusId', label: 'Xếp theo mã trạng thái tăng dần', Icon: ArrowUp10 }
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

export default StatusFilter
