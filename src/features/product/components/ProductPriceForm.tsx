import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Resolver, useForm } from 'react-hook-form'
import { PencilLine } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import productService from '@/features/product/services/productService'

const productPriceFormSchema = z
    .object({
        price: z.coerce.number().min(1000, { message: 'Giá tiền phải lớn hơn hoặc bằng 1000 đồng.' })
    })
    .refine(data => data.price % 1000 === 0, {
        message: 'Giá tiền phải là bội số của 1000 đồng.',
        path: ['price']
    })

type ProductPriceFormProps = {
    product: IRootProduct
    hasModifyItemPermission: boolean
    onUpdateSuccess: () => Promise<any>
}

const ProductPriceForm = ({ product, hasModifyItemPermission, onUpdateSuccess }: ProductPriceFormProps) => {
    const [mode, setMode] = useState<'view' | 'update'>('view')
    const { updateProductPriceMutation } = productService({ enableFetching: false })

    const form = useForm<z.infer<typeof productPriceFormSchema>>({
        resolver: zodResolver(productPriceFormSchema) as Resolver<z.infer<typeof productPriceFormSchema>>,
        defaultValues: {
            price: product.price
        }
    })

    const onSubmit = async (values: z.infer<typeof productPriceFormSchema>) => {
        if (!hasModifyItemPermission) return

        try {
            await updateProductPriceMutation.mutateAsync({
                productId: product.rootProductId,
                data: { price: values.price }
            })

            onUpdateSuccess()
            setMode('view')
        } catch {
            form.reset()
        }
    }

    useEffect(() => {
        form.reset({
            price: product.price
        })
    }, [product, form])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    type="number"
                                    disabled={!hasModifyItemPermission || mode === 'view'}
                                    placeholder="Đơn giá..."
                                    className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {hasModifyItemPermission && (
                    <div className="mt-6 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                        {mode === 'view' && (
                            <Button
                                type="button"
                                onClick={() => {
                                    setMode('update')
                                    form.reset()
                                }}
                                className="h-12 rounded text-base capitalize xl:col-span-2"
                            >
                                <PencilLine />
                                Chỉnh sửa
                            </Button>
                        )}

                        {mode === 'update' && (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setMode('view')
                                        form.reset()
                                    }}
                                    className="h-12 rounded text-base capitalize"
                                >
                                    Hủy bỏ
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!hasModifyItemPermission || form.formState.isSubmitting}
                                    className="h-12 rounded text-base capitalize"
                                >
                                    {form.formState.isSubmitting
                                        ? product.isAccessory === false
                                            ? 'Đang tải và đồng bộ với AI...'
                                            : 'Đang tải...'
                                        : 'Cập nhật giá sản phẩm'}
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </form>
        </Form>
    )
}

export default ProductPriceForm
