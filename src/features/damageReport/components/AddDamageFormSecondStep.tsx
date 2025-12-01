import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { FunnelPlus } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const secondStepFormSchema = z.object({
    items: z
        .array(
            z
                .object({
                    rootProductId: z.number().min(1, { message: 'Vui lòng chọn sản phẩm.' }),
                    productItemId: z.number().min(1, { message: 'Vui lòng chọn phân loại.' }),
                    expectedCost: z.coerce
                        .number()
                        .min(100, { message: 'Thiệt hại ước tính phải lớn hơn hoặc bằng 100 đồng.' }),
                    quantity: z.coerce.number().min(1, { message: 'Số lượng không được bé hơn 1.' }),
                    maxQuantity: z.number()
                })
                .refine(data => data.expectedCost % 100 === 0, {
                    message: 'Thiệt hại ước tính phải là bội số của 100 đồng.',
                    path: ['expectedCost']
                })
                .refine(data => data.quantity <= data.maxQuantity, {
                    message: 'Số lượng không được vượt quá số lượng tồn kho.',
                    path: ['quantity']
                })
        )
        .min(1, { message: 'Phải chọn ít nhất một sản phẩm.' })
        .refine(items => new Set(items.map(v => v.productItemId)).size === items.length, {
            message: 'Các phân loại của cùng một sản phẩm trong đơn nhập hàng phải là duy nhất.'
        })
})

export type SecondStepData = z.infer<typeof secondStepFormSchema>

type AddDamageFormSecondStepProps = {
    defaultValues: SecondStepData | null
    rootProducts: IRootProduct[]
    onNext: (values: SecondStepData) => void
    onPrev: () => void
}

const AddDamageFormSecondStep = ({ defaultValues, rootProducts, onNext, onPrev }: AddDamageFormSecondStepProps) => {
    const form = useForm<SecondStepData>({
        resolver: zodResolver(secondStepFormSchema) as any,
        defaultValues: defaultValues ?? {
            items: [{ rootProductId: 0, productItemId: 0, expectedCost: 0, quantity: 1, maxQuantity: 0 }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items'
    })

    const onSubmit = (values: SecondStepData) => {
        onNext(values)
    }

    const getVariants = (productId: number) => {
        const product = rootProducts.find(rp => rp.rootProductId === productId)
        if (!product) return []

        return (product.productItems ?? []).map(pi => ({
            productItemId: pi.productItemId,
            label: pi.size,
            stock: pi.stock
        }))
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <span className="font-medium">Tổng số sản phẩm: {form.getValues('items').length}</span>
                    <Button
                        type="button"
                        onClick={() =>
                            append({
                                rootProductId: 0,
                                productItemId: 0,
                                expectedCost: 0,
                                quantity: 1,
                                maxQuantity: 0
                            })
                        }
                    >
                        <FunnelPlus /> Thêm sản phẩm
                    </Button>
                </div>

                <div className="flex flex-col gap-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-6 rounded-md border-2 p-4">
                            <FormField
                                control={form.control}
                                name={`items.${index}.rootProductId`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Sản phẩm</FormLabel>
                                        <Select
                                            onValueChange={value => {
                                                field.onChange(Number(value))
                                                form.setValue(
                                                    `items.${index}.expectedCost`,
                                                    rootProducts.find(rp => rp.rootProductId === Number(value))
                                                        ?.price ?? 0
                                                )
                                            }}
                                            value={String(field.value ?? '')}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                    <SelectValue placeholder="Sản phẩm..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {rootProducts.map(rootProduct => (
                                                    <SelectItem
                                                        key={rootProduct.rootProductId}
                                                        value={rootProduct.rootProductId.toString()}
                                                    >
                                                        {rootProduct.name}
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
                                name={`items.${index}.productItemId`}
                                render={({ field }) => {
                                    const variants = getVariants(form.watch(`items.${index}.rootProductId`))

                                    return (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Phân loại</FormLabel>
                                            <Select
                                                onValueChange={value => {
                                                    field.onChange(Number(value))
                                                    const selectedVariant = variants.find(
                                                        v => v.productItemId === Number(value)
                                                    )
                                                    form.setValue(
                                                        `items.${index}.maxQuantity`,
                                                        selectedVariant?.stock ?? 0
                                                    )
                                                }}
                                                value={String(field.value ?? '')}
                                                disabled={!form.watch(`items.${index}.rootProductId`)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                        <SelectValue placeholder="Phân loại..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {variants.map(productItem => (
                                                        <SelectItem
                                                            key={productItem.productItemId}
                                                            value={productItem.productItemId!.toString()}
                                                            disabled={productItem.stock! <= 0}
                                                        >
                                                            {productItem.label} (Tồn kho:{' '}
                                                            {productItem.stock?.toString().padStart(2, '0')})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />

                            <div className="grid w-full grid-cols-2 items-start gap-4">
                                <FormField
                                    control={form.control}
                                    name={`items.${index}.expectedCost`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Thiệt hại ước tính</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Thiệt hại ước tính..."
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
                                    name={`items.${index}.quantity`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Số lượng</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Số lượng..."
                                                    className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="mt-4 flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    disabled={fields.length <= 1}
                                    onClick={() => {
                                        if (fields.length > 1) remove(index)
                                    }}
                                >
                                    Xóa sản phẩm
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                {form.formState.errors.items?.root && (
                    <p className="text-destructive mt-2 text-sm">{form.formState.errors.items.root.message}</p>
                )}

                <div className="mt-6 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPrev}
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

export default AddDamageFormSecondStep
