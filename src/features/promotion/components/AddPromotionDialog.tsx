import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon, PencilLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import dayjs from '@/libs/dayjs'

const addPromotionFormSchema = z
    .object({
        name: z.string().min(1, { message: 'Tên chương trình khuyến mãi không được để trống.' }),
        description: z.string().min(1, { message: 'Mô tả chương trình khuyến mãi không được để trống.' }),
        discountRate: z
            .number('Giá trị giảm giá phải là số')
            .int('Giá trị giảm giá phải là số nguyên')
            .min(1, { message: 'Giá trị giảm giá phải lớn hơn hoặc bằng 1.' })
            .max(100, { message: 'Giá trị giảm giá phải nhỏ hơn hoặc bằng 100.' }),
        startDate: z
            .date({ error: 'Ngày bắt đầu không được để trống.' })
            .refine(date => date >= dayjs().startOf('day').toDate(), {
                message: 'Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại.'
            }),
        endDate: z.date({ error: 'Ngày kết thúc không được để trống.' }),
        products: z.array(z.number()).min(1, { message: 'Vui lòng chọn ít nhất một sản phẩm.' })
    })
    .refine(data => data.endDate >= data.startDate, {
        message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.',
        path: ['endDate']
    })

type AddPromotionDialogProps = {
    products: IRootProduct[]
    addNewPromotionMutation: UseMutationResult<any, any, Partial<IPromotion>, any>
}

const AddPromotionDialog = ({ products, addNewPromotionMutation }: AddPromotionDialogProps) => {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof addPromotionFormSchema>>({
        resolver: zodResolver(addPromotionFormSchema),
        defaultValues: {
            name: '',
            description: '',
            discountRate: 1,
            startDate: undefined,
            endDate: undefined,
            products: []
        }
    })

    const onSubmit = async (values: z.infer<typeof addPromotionFormSchema>) => {
        await addNewPromotionMutation.mutateAsync({
            name: values.name,
            description: values.description,
            discountRate: values.discountRate,
            startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
            products: values.products
        })

        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="lighter">
                    <PencilLine />
                    Thêm khuyến mãi
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thêm chương trình khuyến mãi</DialogTitle>
                    <DialogDescription>
                        Thêm các thông tin cần thiết cho chương trình khuyến mãi. Ấn "Xác nhận" sau khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-3 items-start gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel className="text-card-foreground">
                                                Tên chương trình khuyến mãi
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Tên chương trình khuyến mãi..."
                                                    className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="discountRate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Phần trăm giảm</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Phần trăm giảm..."
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
                            </div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Mô tả</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={4}
                                                placeholder="Mô tả..."
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
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Ngày bắt đầu</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={'outline'}
                                                            className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2"
                                                        >
                                                            {field.value ? (
                                                                format(field.value, 'dd LLL, y', { locale: vi })
                                                            ) : (
                                                                <span>Chọn ngày bắt đầu</span>
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
                                                        disabled={date =>
                                                            date < dayjs().startOf('day').toDate() ||
                                                            date < new Date('1900-01-01')
                                                        }
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
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Ngày kết thúc</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={'outline'}
                                                            className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2"
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
                                                        disabled={date =>
                                                            date < dayjs(form.getValues('startDate')).toDate() ||
                                                            date < new Date('1900-01-01')
                                                        }
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
                            <FormField
                                control={form.control}
                                name="products"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Danh sách sản phẩm</FormLabel>
                                        <div className="grid max-h-[120px] grid-cols-1 gap-2 overflow-y-auto">
                                            {products.map(product => (
                                                <FormField
                                                    key={product.rootProductId}
                                                    control={form.control}
                                                    name="products"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={product.rootProductId}
                                                                className="flex flex-row items-center gap-2"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(
                                                                            product.rootProductId
                                                                        )}
                                                                        onCheckedChange={checked => {
                                                                            return checked
                                                                                ? field.onChange([
                                                                                      ...field.value,
                                                                                      product.rootProductId
                                                                                  ])
                                                                                : field.onChange(
                                                                                      field.value?.filter(
                                                                                          value =>
                                                                                              value !==
                                                                                              product.rootProductId
                                                                                      )
                                                                                  )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-card-foreground text-sm font-normal">
                                                                    {product.name}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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

export default AddPromotionDialog
