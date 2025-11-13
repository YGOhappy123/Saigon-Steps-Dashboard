import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PencilLine } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

const addStatusFormSchema = z.object({
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

type AddStatusDialogProps = {
    addNewStatusMutation: UseMutationResult<any, any, Partial<IOrderStatus>, any>
    statusActions: {
        name: string
        label: string
        shorten: string
    }[]
}

const AddStatusDialog = ({ addNewStatusMutation, statusActions }: AddStatusDialogProps) => {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof addStatusFormSchema>>({
        resolver: zodResolver(addStatusFormSchema),
        defaultValues: {
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

    const onSubmit = async (values: z.infer<typeof addStatusFormSchema>) => {
        await addNewStatusMutation.mutateAsync({
            name: values.name,
            description: values.description,
            color: values.color,
            shouldReserveStock: values.shouldReserveStock,
            shouldReleaseStock: values.shouldReleaseStock,
            shouldReduceStock: values.shouldReduceStock,
            shouldIncreaseStock: values.shouldIncreaseStock,
            shouldMarkAsDelivered: values.shouldMarkAsDelivered,
            shouldMarkAsRefunded: values.shouldMarkAsRefunded,
            shouldSendNotification: values.shouldSendNotification
        })

        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="lighter">
                    <PencilLine />
                    Thêm trạng thái
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thêm trạng thái đơn hàng</DialogTitle>
                    <DialogDescription>
                        Thêm các thông tin cần thiết cho trạng thái. Ấn "Xác nhận" sau khi hoàn tất.
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

                            <div className="grid max-h-[120px] grid-cols-1 gap-2 overflow-y-auto">
                                <FormLabel className="text-card-foreground">Danh sách tác vụ</FormLabel>
                                {statusActions.map(item => (
                                    <FormField
                                        key={item.name}
                                        control={form.control}
                                        name={item.name as keyof z.infer<typeof addStatusFormSchema>}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center gap-2">
                                                <FormControl>
                                                    <Checkbox
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

export default AddStatusDialog
