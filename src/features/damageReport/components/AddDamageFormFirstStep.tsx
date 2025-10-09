import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { INVENTORY_DAMAGE_REASON_OPTIONS } from '@/configs/constants'

const firstStepFormSchema = z
    .object({
        reason: z.enum(['LOST', 'BROKEN', 'DEFECTIVE', 'OTHER'], { message: 'Phân loại không được để trống.' }),
        note: z.string().optional()
    })
    .refine(
        data => {
            if (data.reason === 'OTHER') {
                return data.note && data.note.trim().length > 0
            }
            return true
        },
        { message: 'Vui lòng cung cấp mô tả khi nguyên nhân là "KHÁC".', path: ['note'] }
    )

export type FirstStepData = z.infer<typeof firstStepFormSchema>

type AddDamageFormFirstStepProps = {
    defaultValues: FirstStepData | null
    onNext: (values: FirstStepData) => void
}

const AddDamageFormFirstStep = ({ defaultValues, onNext }: AddDamageFormFirstStepProps) => {
    const form = useForm<FirstStepData>({
        resolver: zodResolver(firstStepFormSchema),
        defaultValues: defaultValues ?? {
            reason: 'BROKEN',
            note: ''
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
                        name="reason"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Phân loại</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                            <SelectValue placeholder="Danh mục..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {INVENTORY_DAMAGE_REASON_OPTIONS.map(reason => (
                                            <SelectItem key={reason.value} value={reason.value}>
                                                {reason.label}
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
                        name="note"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Ghi chú</FormLabel>
                                <FormControl>
                                    <Textarea
                                        rows={4}
                                        placeholder="Ghi chú..."
                                        className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
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

export default AddDamageFormFirstStep
