import { useEffect, useState } from 'react'
import { RoleSortAndFilterParams } from '@/features/personnel/services/roleService'
import { PopoverContent } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowDown10, ArrowUp10, CircleCheck, CircleStar, CircleX } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

type RoleFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: RoleSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
    permissions: IPermission[]
}

const RoleFilter = ({ setHavingFilters, onChange, onSearch, onReset, permissions }: RoleFilterProps) => {
    const [searchName, setSearchName] = useState<string>('')
    const [searchPermissions, setSearchPermissions] = useState<number[]>([])
    const [searchIsImmutable, setSearchIsImmutable] = useState<boolean | undefined>(undefined)
    const [sort, setSort] = useState<string>('-roleId')

    useEffect(() => {
        const appliedFilters: RoleSortAndFilterParams = {
            searchName: searchName,
            searchIsImmutable: searchIsImmutable,
            searchPermissions: searchPermissions,
            sort: sort
        }

        onChange(appliedFilters)
    }, [searchName, searchPermissions, searchIsImmutable, sort])

    const handleSearch = () => {
        onSearch()

        const isChanged =
            searchName !== '' || searchPermissions.length > 0 || searchIsImmutable !== null || sort !== '-roleId'
        setHavingFilters(isChanged)
    }

    const handleReset = () => {
        setSearchName('')
        setSearchPermissions([])
        setSearchIsImmutable(undefined)
        setSort('-roleId')

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
                        Lọc theo quyền truy cập khả dụng
                    </h3>
                    <div className="mt-2 flex max-h-[200px] flex-col gap-2 overflow-y-auto pr-2">
                        {permissions.map(permission => (
                            <div key={permission.permissionId} className="flex items-center gap-3">
                                <Checkbox
                                    checked={searchPermissions.includes(permission.permissionId)}
                                    onCheckedChange={checked => {
                                        setSearchPermissions(prev => {
                                            if (checked) {
                                                return [...prev, permission.permissionId].sort()
                                            } else {
                                                return prev.filter(ft => ft !== permission.permissionId)
                                            }
                                        })
                                    }}
                                    className="cursor-pointer"
                                />
                                <p className="flex-1 truncate text-sm">{permission.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <Select
                    value={searchIsImmutable === undefined ? 'undefined' : searchIsImmutable.toString()}
                    onValueChange={value =>
                        setSearchIsImmutable(value === 'true' ? true : value === 'false' ? false : undefined)
                    }
                >
                    <SelectTrigger className="text-card-foreground h-10! w-full rounded border-2 text-sm font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[
                            { value: 'undefined', label: 'Lọc theo loại: Tất cả', Icon: CircleStar },
                            { value: 'true', label: 'Lọc theo loại: Không thể thay đổi', Icon: CircleCheck },
                            { value: 'false', label: 'Lọc theo loại: Có thể thay đổi', Icon: CircleX }
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
                            { value: '-roleId', label: 'Xếp theo mã vai trò giảm dần', Icon: ArrowDown10 },
                            { value: '+roleId', label: 'Xếp theo mã vai trò tăng dần', Icon: ArrowUp10 }
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

export default RoleFilter
