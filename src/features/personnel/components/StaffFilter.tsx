import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { StaffSortAndFilterParams } from '@/features/personnel/services/staffService'
import { PopoverContent } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowDown10, ArrowUp10, CircleCheck, CircleStar, CircleX } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import DateRangePicker from '@/components/common/DateRangePicker'

type StaffFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: StaffSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
    roles: IStaffRole[]
}

const StaffFilter = ({ setHavingFilters, onChange, onSearch, onReset, roles }: StaffFilterProps) => {
    const [searchName, setSearchName] = useState<string>('')
    const [searchEmail, setSearchEmail] = useState<string>('')
    const [searchRole, setSearchRole] = useState<number>(0)
    const [searchIsActive, setSearchIsActive] = useState<boolean | undefined>(undefined)
    const [searchRange, setSearchRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-staffId')

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
        const appliedFilters: StaffSortAndFilterParams = {
            searchName: searchName,
            searchEmail: searchEmail,
            searchRole: searchRole,
            searchIsActive: searchIsActive,
            searchRange: searchRange,
            sort: sort
        }

        onChange(appliedFilters)
    }, [searchName, searchEmail, searchRole, searchIsActive, searchRange, sort])

    const handleSearch = () => {
        onSearch()

        const isChanged =
            searchName !== '' ||
            searchEmail !== '' ||
            searchRole !== 0 ||
            searchIsActive !== null ||
            (searchRange && searchRange.length > 0) ||
            sort !== '-staffId'
        setHavingFilters(isChanged)
    }

    const handleReset = () => {
        setSearchName('')
        setSearchEmail('')
        setSearchRole(0)
        setSearchIsActive(undefined)
        setSearchRange([])
        setSort('-staffId')
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
                    placeholder="Lọc theo tên nhân viên..."
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

                <DateRangePicker
                    date={date}
                    setDate={setDate}
                    placeHolder="Lọc theo ngày tạo tài khoản..."
                    triggerClassName="text-card-foreground h-10 text-sm"
                />

                <Select value={searchRole.toString()} onValueChange={value => setSearchRole(parseInt(value))}>
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        <SelectItem key={0} value="0">
                            Lọc theo vai trò: Tất cả
                        </SelectItem>
                        {roles.map(role => (
                            <SelectItem key={role.roleId} value={role.roleId.toString()}>
                                Lọc theo vai trò: {role.name}
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
                            { value: 'undefined', label: 'Lọc theo trạng thái: Tất cả', Icon: CircleStar },
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
                            { value: '-staffId', label: 'Xếp theo mã nhân viên giảm dần', Icon: ArrowDown10 },
                            { value: '+staffId', label: 'Xếp theo mã nhân viên tăng dần', Icon: ArrowUp10 },
                            { value: '-createdAt', label: 'Xếp theo ngày tạo giảm dần', Icon: ArrowDown10 },
                            { value: '+createdAt', label: 'Xếp theo ngày tạo tăng dần', Icon: ArrowUp10 }
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

export default StaffFilter
