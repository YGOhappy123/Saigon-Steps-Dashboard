import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon, PencilLine } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
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

const addCouponFormSchema = z
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
    .refine(data => data.type !== 'FIXED' || (data.amount >= 1000 && data.amount % 1000 === 0), {
        message: 'Giá trị giảm phải lớn hơn hoặc bằng 1000 đồng và là bội số của 1000 đồng.',
        path: ['amount']
    })
    .refine(data => data.type !== 'PERCENTAGE' || (data.amount >= 1 && data.amount <= 100), {
        message: 'Giá trị giảm phải nằm trong khoảng từ 1% đến 100%.',
        path: ['amount']
    })

type AddCouponDialogProps = {
    addNewCouponMutation: UseMutationResult<any, any, Partial<ICoupon>, any>
}

const AddCouponDialog = ({ addNewCouponMutation }: AddCouponDialogProps) => {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof addCouponFormSchema>>({
        resolver: zodResolver(addCouponFormSchema),
        defaultValues: {
            code: '',
            type: 'FIXED',
            amount: 1,
            maxUsage: undefined,
            expiredAt: undefined
        }
    })

    const onSubmit = async (values: z.infer<typeof addCouponFormSchema>) => {
        await addNewCouponMutation.mutateAsync({
            code: values.code,
            type: values.type,
            amount: values.amount,
            maxUsage: values.maxUsage,
            expiredAt: values.expiredAt ? dayjs(values.expiredAt).format('YYYY-MM-DD') : undefined
        })

        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="lighter">
                    <PencilLine />
                    Thêm phiếu giảm giá
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thêm phiếu giảm giá</DialogTitle>
                    <DialogDescription>
                        Thêm các thông tin cần thiết cho phiếu giảm giá. Ấn "Xác nhận" sau khi hoàn tất.
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
                                            <Select onValueChange={field.onChange} value={field.value}>
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
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Đặt lại
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset()
                                    setOpen(false)
                                }}
                            >
                                Hủy bỏ
                            </Button>
                            <Button type="submit">Xác nhận</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddCouponDialog
