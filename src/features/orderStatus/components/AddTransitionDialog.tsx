import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const addTransitionFormSchema = z.object({
    fromStatusId: z.number().min(1, { message: 'Vui lòng chọn trạng thái nguồn.' }),
    toStatusId: z.number().min(1, { message: 'Vui lòng chọn trạng thái đích.' }),
    label: z.string().min(1, { message: 'Mô tả không được để trống.' }),
    isScanningRequired: z.boolean()
})

type AddTransitionDialogProps = {
    fromStatus: IOrderStatus | null
    availableStatuses: IOrderStatus[]
    open: boolean
    setOpen: (value: boolean) => void
    addNewTransitionMutation: UseMutationResult<any, any, Partial<IOrderStatusTransition>, any>
}

const AddTransitionDialog = ({
    fromStatus,
    availableStatuses,
    open,
    setOpen,
    addNewTransitionMutation
}: AddTransitionDialogProps) => {
    const form = useForm<z.infer<typeof addTransitionFormSchema>>({
        resolver: zodResolver(addTransitionFormSchema),
        defaultValues: {
            fromStatusId: 0,
            toStatusId: 0,
            label: '',
            isScanningRequired: false
        }
    })

    const onSubmit = async (values: z.infer<typeof addTransitionFormSchema>) => {
        if (!fromStatus) return

        await addNewTransitionMutation.mutateAsync({
            fromStatusId: values.fromStatusId,
            toStatusId: values.toStatusId,
            label: values.label,
            isScanningRequired: values.isScanningRequired
        })

        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (open && fromStatus) {
            form.reset({
                fromStatusId: fromStatus.statusId,
                toStatusId: 0,
                label: '',
                isScanningRequired: false
            })
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thêm hướng chuyển trạng thái</DialogTitle>
                    <DialogDescription>
                        Chọn trạng thái đích và mô tả cho hướng chuyển. Ấn "Xác nhận" sau khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="fromStatusId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Trạng thái khởi nguồn</FormLabel>
                                    <Select
                                        onValueChange={value => field.onChange(Number(value))}
                                        value={field.value?.toString() ?? ''}
                                        disabled
                                    >
                                        <FormControl>
                                            <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                <SelectValue placeholder="Trạng thái khởi nguồn..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={fromStatus!.statusId.toString()}>
                                                {fromStatus?.name}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="toStatusId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Trạng thái đích đến</FormLabel>
                                    <Select
                                        onValueChange={value => field.onChange(Number(value))}
                                        value={field.value?.toString() ?? ''}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                <SelectValue placeholder="Trạng thái đích đến..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableStatuses.map(status => (
                                                <SelectItem key={status.statusId} value={status.statusId.toString()}>
                                                    {status.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isScanningRequired"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Yêu cầu quét</FormLabel>
                                    <Select
                                        onValueChange={value => field.onChange(value === 'true')}
                                        defaultValue={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                <SelectValue placeholder="Chọn yêu cầu quét..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="false">Không cần quét mã vạch barcode</SelectItem>
                                            <SelectItem value="true">Yêu cầu quét mã vạch barcode</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            rows={4}
                                            placeholder="Mô tả..."
                                            className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                            <Button type="submit" disabled={form.formState.isLoading}>
                                Xác nhận
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddTransitionDialog
