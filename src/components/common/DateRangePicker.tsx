import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { twMerge } from 'tailwind-merge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type DateRangePickerProps = {
    date: DateRange | undefined
    setDate: (value: DateRange | undefined) => void
    className?: string
    triggerClassName?: string
    placeHolder?: string
    disableFutureDates?: boolean
}

const DateRangePicker = ({
    date,
    setDate,
    className,
    triggerClassName,
    placeHolder,
    disableFutureDates
}: DateRangePickerProps) => {
    return (
        <div className={twMerge(`${className}`)}>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        className={twMerge(
                            `text-primary focus:border-ring focus:ring-ring/50 flex w-full items-center gap-2 rounded border-2 border-neutral-500 px-3 py-2 leading-[2.15] font-medium focus:ring-[3px] ${triggerClassName}`
                        )}
                    >
                        <CalendarIcon size={16} />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'dd LLL, y', { locale: vi })} -{' '}
                                    {format(date.to, 'dd LLL, y', { locale: vi })}
                                </>
                            ) : (
                                format(date.from, 'dd LLL, y', { locale: vi })
                            )
                        ) : (
                            <span>{placeHolder || 'Lọc theo ngày tạo'}</span>
                        )}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                    <Calendar
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        locale={vi}
                        disabled={disableFutureDates ? { after: new Date() } : undefined}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default DateRangePicker
