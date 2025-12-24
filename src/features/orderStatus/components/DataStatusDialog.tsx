import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
import { PencilLine } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

const baseSchema = z.object({
    name: z.string().min(1, { message: 'Tên trạng thái không được để trống.' }),
    description: z.string().min(1, { message: 'Mô tả trạng thái không được để trống.' }),
    color: z.string().min(1, { message: 'Màu sắc trạng thái không được để trống.' }),
    shouldReserveStock: z.boolean(),
    shouldReleaseStock: z.boolean(),
    shouldReduceStock: z.boolean(),
    shouldIncreaseStock: z.boolean(),
    shouldMarkAsDelivered: z.boolean(),
    shouldMarkAsRefunded: z.boolean(),
    shouldSendNotification: z.boolean()
})

const explanationRequiredSchema = baseSchema.extend({
    type: z.literal('require'),
    explanationLabel: z.string().min(1, { message: 'Mô tả yêu cầu không được để trống.' })
})

const noExplanationRequiredSchema = baseSchema.extend({
    type: z.literal('no_require')
})

const dataStatusFormSchema = z.discriminatedUnion('type', [explanationRequiredSchema, noExplanationRequiredSchema])

type DataStatusDialogProps = {
    status: IOrderStatus | null
    mode: 'view' | 'update'
    setMode: (value: 'view' | 'update') => void
    open: boolean
    setOpen: (value: boolean) => void
    updateStatusMutation: UseMutationResult<any, any, { statusId: number; data: Partial<IOrderStatus> }, any>
    hasUpdatePermission: boolean
    statusActions: {
        name: string
        shorten: string
        label: string
    }[]
}

const DataStatusDialog = ({
    status,
    updateStatusMutation,
    hasUpdatePermission,
    mode,
    open,
    setMode,
    setOpen,
    statusActions
}: DataStatusDialogProps) => {
    const form = useForm<z.infer<typeof dataStatusFormSchema>>({
        resolver: zodResolver(dataStatusFormSchema),
        defaultValues: {
            type: 'no_require',
            name: '',
            description: '',
            color: '#f4f4f5',
            shouldReserveStock: false,
            shouldReleaseStock: false,
            shouldReduceStock: false,
            shouldIncreaseStock: false,
            shouldMarkAsDelivered: false,
            shouldMarkAsRefunded: false,
            shouldSendNotification: false
        }
    })

    const onSubmit = async (values: z.infer<typeof dataStatusFormSchema>) => {
        if (!status || !hasUpdatePermission) return

        const data: Partial<IOrderStatus> = {
            name: values.name,
            description: values.description,
            color: values.color,
            isExplanationRequired: values.type === 'require',
            shouldReserveStock: values.shouldReserveStock,
            shouldReleaseStock: values.shouldReleaseStock,
            shouldReduceStock: values.shouldReduceStock,
            shouldIncreaseStock: values.shouldIncreaseStock,
            shouldMarkAsDelivered: values.shouldMarkAsDelivered,
            shouldMarkAsRefunded: values.shouldMarkAsRefunded,
            shouldSendNotification: values.shouldSendNotification
        }
        if (values.type === 'require') {
            data.explanationLabel = values.explanationLabel
        }

        await updateStatusMutation.mutateAsync({
            statusId: status.statusId,
            data: data
        })

        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (open && status) {
            form.reset({
                type: status.isExplanationRequired ? 'require' : ('no_require' as any),
                explanationLabel: status.explanationLabel || '',
                name: status.name,
                description: status.description,
                color: status.color,
                shouldReserveStock: status.shouldReserveStock,
                shouldReleaseStock: status.shouldReleaseStock,
                shouldReduceStock: status.shouldReduceStock,
                shouldIncreaseStock: status.shouldIncreaseStock,
                shouldMarkAsDelivered: status.shouldMarkAsDelivered,
                shouldMarkAsRefunded: status.shouldMarkAsRefunded,
                shouldSendNotification: status.shouldSendNotification
            })
        }
    }, [open, mode])

    const type = form.watch('type')

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'view' ? 'Thông tin trạng thái đơn hàng' : 'Cập nhật trạng thái đơn hàng'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'view'
                            ? 'Thông tin chi tiết về tên, mô tả và các tác vụ của trạng thái đơn hàng.'
                            : 'Chỉnh sửa các thông tin của trạng thái đơn hàng. Ấn "Xác nhận" sau khi hoàn tất.'}
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
                                            <FormLabel className="text-card-foreground">Tên trạng thái</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={mode === 'view'}
                                                    placeholder="Tên trạng thái..."
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
                                    name="color"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Màu sắc trạng thái</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={mode === 'view'}
                                                    placeholder="Màu sắc trạng thái..."
                                                    className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                                    type="color"
                                                    {...field}
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
                                                disabled={mode === 'view'}
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
                                <div className={twMerge('flex flex-col gap-2', type === 'no_require' && 'col-span-2')}>
                                    <FormLabel className="text-card-foreground">Loại yêu cầu</FormLabel>
                                    <Select
                                        onValueChange={value => {
                                            form.setValue('type', value as 'require' | 'no_require')
                                            if (value === 'require') form.setValue('explanationLabel', '')
                                        }}
                                        defaultValue={status?.isExplanationRequired ? 'require' : 'no_require'}
                                    >
                                        <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                            <SelectValue placeholder="Chọn loại yêu cầu..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="require">Yêu cầu nguyên nhân/ giải thích</SelectItem>
                                            <SelectItem value="no_require">
                                                Không yêu cầu nguyên nhân/ giải thích
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {type === 'require' && (
                                    <FormField
                                        control={form.control}
                                        name="explanationLabel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-card-foreground">Mô tả yêu cầu</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Mô tả yêu cầu..."
                                                        className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            <div className="grid max-h-[120px] grid-cols-1 gap-2 overflow-y-auto">
                                <FormLabel className="text-card-foreground">Danh sách tác vụ</FormLabel>
                                {statusActions.map(item => (
                                    <FormField
                                        key={item.name}
                                        control={form.control}
                                        name={item.name as keyof z.infer<typeof dataStatusFormSchema>}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center gap-2">
                                                <FormControl>
                                                    <Checkbox
                                                        disabled={mode === 'view'}
                                                        checked={field.value as boolean}
                                                        onCheckedChange={checked => {
                                                            field.onChange(checked)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-card-foreground text-sm font-normal">
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                        <Separator />
                        {mode === 'update' && (
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Hủy bỏ</Button>
                                </DialogClose>
                                <Button type="submit">Xác nhận</Button>
                            </DialogFooter>
                        )}
                    </form>
                </Form>

                {/* Move <DialogFooter /> outside <Form /> to prevent auto-submitting behavior */}
                {mode === 'view' && (
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Đóng</Button>
                        </DialogClose>
                        {hasUpdatePermission && (
                            <Button type="button" onClick={() => setMode('update')}>
                                <PencilLine />
                                Chỉnh sửa
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default DataStatusDialog
