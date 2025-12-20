import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { COUPON_TYPE_OPTIONS } from '@/configs/constants'
import dayjs from '@/libs/dayjs'

const dataCouponFormSchema = z
    .object({
        code: z.string().min(1, { message: 'Mã phiếu giảm giá không được để trống.' }),
        type: z.enum(['FIXED', 'PERCENTAGE'], { message: 'Loại giảm giá không được để trống.' }),
        amount: z.number(),
        maxUsage: z
            .number()
            .optional()
            .refine(num => num === undefined || num >= 1, {
                message: 'Số lượt dùng tối đa phải lớn hơn hoặc bằng 1.'
            }),
        expiredAt: z
            .date()
            .optional()
            .refine(date => date === undefined || date >= dayjs().startOf('day').toDate(), {
                message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày hiện tại.'
            })
    })
    .refine(data => data.type !== 'FIXED' || data.amount % 1000 === 0, {
        message: 'Giá trị giảm phải là bội số của 1000 đồng.',
        path: ['amount']
    })
    .refine(data => data.type !== 'PERCENTAGE' || (data.amount >= 1 && data.amount <= 100), {
        message: 'Giá trị giảm phải nằm trong khoảng từ 1% đến 100%.',
        path: ['amount']
    })

type DataCouponDialogProps = {
    coupon: ICoupon | null
    open: boolean
    setOpen: (value: boolean) => void
}

const DataCouponDialog = ({ coupon, open, setOpen }: DataCouponDialogProps) => {
    const form = useForm<z.infer<typeof dataCouponFormSchema>>({
        resolver: zodResolver(dataCouponFormSchema),
        defaultValues: {
            code: '',
            type: 'FIXED',
            amount: 1,
            maxUsage: undefined,
            expiredAt: undefined
        }
    })

    const onSubmit = async (_: z.infer<typeof dataCouponFormSchema>) => {
        if (!coupon) return

        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (open && coupon) {
            form.reset({
                code: coupon.code,
                type: coupon.type,
                amount: coupon.amount,
                maxUsage: coupon.maxUsage ?? undefined,
                expiredAt: coupon.expiredAt ? new Date(coupon.expiredAt) : undefined
            })
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thông tin mã giảm giá</DialogTitle>
                    <DialogDescription>
                        Thông tin chi tiết về mã code, loại và thời gian áp dụng của mã giảm giá.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="text-card-foreground">Mã code phiếu giảm giá</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled
                                                placeholder="Mã code phiếu giảm giá..."
                                                className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 items-start gap-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Giá trị giảm</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled
                                                    placeholder="Giá trị giảm..."
                                                    type="number"
                                                    className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                                    {...field}
                                                    onChange={e => {
                                                        const value = e.target.value
                                                        field.onChange(value === '' ? '' : Number(value))
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Loại phiếu giảm giá</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled>
                                                <FormControl>
                                                    <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                        <SelectValue placeholder="Danh mục..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {COUPON_TYPE_OPTIONS.map(type => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 items-start gap-4">
                                <FormField
                                    control={form.control}
                                    name="maxUsage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Lượt dùng tối đa</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled
                                                    placeholder="Lượt dùng tối đa..."
                                                    type="number"
                                                    className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                                    {...field}
                                                    onChange={e => {
                                                        const value = e.target.value
                                                        field.onChange(value === '' ? '' : Number(value))
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="expiredAt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Ngày kết thúc</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            disabled
                                                            variant="outline"
                                                            className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold"
                                                        >
                                                            {field.value ? (
                                                                format(field.value, 'dd LLL, y', { locale: vi })
                                                            ) : (
                                                                <span>Chọn ngày kết thúc</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={field.onChange}
                                                        disabled={date => date < dayjs().startOf('day').toDate()}
                                                        captionLayout="dropdown"
                                                        locale={vi}
                                                        required
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <Separator />
                    </form>
                </Form>

                {/* Move <DialogFooter /> outside <Form /> to prevent auto-submitting behavior */}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Đóng</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DataCouponDialog
