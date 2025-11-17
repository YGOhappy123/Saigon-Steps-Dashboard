import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon, ClockIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const firstStepFormSchema = z.object({
    invoiceNumber: z.string().min(1, { message: 'Mã hóa đơn không được để trống.' }),
    importDate: z.date({ error: 'Ngày nhập hàng không được để trống.' })
})

export type FirstStepData = z.infer<typeof firstStepFormSchema>

type AddImportFormFirstStepProps = {
    defaultValues: FirstStepData | null
    onNext: (values: FirstStepData) => void
}

const AddImportFormFirstStep = ({ defaultValues, onNext }: AddImportFormFirstStepProps) => {
    const form = useForm<FirstStepData>({
        resolver: zodResolver(firstStepFormSchema),
        defaultValues: defaultValues ?? {
            invoiceNumber: '',
            importDate: new Date()
        }
    })

    const onSubmit = (values: FirstStepData) => {
        onNext(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="flex flex-col gap-6">
                    <FormField
                        control={form.control}
                        name="invoiceNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Mã hóa đơn</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Mã hóa đơn..."
                                        className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="importDate"
                        render={({ field }) => {
                            const current = field.value ? new Date(field.value) : undefined
                            const defaultTime = current ? format(current, 'HH:mm:ss') : '07:00:00'
                            const [date, setDate] = useState<Date | undefined>(current)
                            const [time, setTime] = useState<string>(defaultTime)

                            useEffect(() => {
                                if (!date) {
                                    field.onChange(undefined)
                                    return
                                }
                                const [h, m, s] = time.split(':').map(Number)
                                const newDate = new Date(date)
                                newDate.setHours(h)
                                newDate.setMinutes(m)
                                newDate.setSeconds(s)
                                field.onChange(newDate)
                            }, [date, time])

                            return (
                                <FormItem className="flex items-start gap-4">
                                    <div className="flex flex-1 flex-col gap-2">
                                        <FormLabel className="text-card-foreground">Ngày nhập hàng</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold"
                                                    >
                                                        {field.value ? (
                                                            format(field.value, 'dd LLL, y', { locale: vi })
                                                        ) : (
                                                            <span>Chọn ngày nhập hàng</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={d => setDate(d || undefined)}
                                                    disabled={d => d > new Date() || d < new Date('1900-01-01')}
                                                    captionLayout="dropdown"
                                                    locale={vi}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <FormLabel className="text-card-foreground">Giờ nhập hàng</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="time"
                                                    id="time"
                                                    step="1"
                                                    className="caret-card-foreground text-card-foreground h-12 w-fit appearance-none rounded border-2 pr-10 font-semibold [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                    value={time}
                                                    onChange={e => setTime(e.target.value)}
                                                />
                                                <Label
                                                    htmlFor="time"
                                                    className="absolute top-0 right-0 flex h-full cursor-pointer items-center py-2 pr-3 pl-1"
                                                >
                                                    <ClockIcon className="h-4 w-4 opacity-50" />
                                                </Label>
                                            </div>
                                        </FormControl>
                                    </div>

                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                </div>

                <div className="mt-6 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={true}
                        className="h-12 rounded text-base capitalize"
                    >
                        Quay về bước trước
                    </Button>
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="h-12 rounded text-base capitalize"
                    >
                        {form.formState.isSubmitting ? 'Đang tải...' : 'Đến bước kế tiếp'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default AddImportFormFirstStep
