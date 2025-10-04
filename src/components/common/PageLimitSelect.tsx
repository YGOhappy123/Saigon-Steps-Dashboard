import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type PageLimitSelectProps = {
    limit: number
    setLimit: (limit: number) => void
}

const PageLimitSelect = ({ limit, setLimit }: PageLimitSelectProps) => {
    return (
        <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Số dòng mỗi trang</p>
            <Select
                value={limit.toString()}
                onValueChange={value => {
                    setLimit(Number(value))
                }}
            >
                <SelectTrigger className="h-8 w-[120px]">
                    <SelectValue placeholder={limit.toString()} />
                </SelectTrigger>
                <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize} dòng
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default PageLimitSelect
