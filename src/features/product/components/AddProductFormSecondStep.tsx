import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Trash2 } from 'lucide-react'
import { Form, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import ProductImageUploader from '@/features/product/components/ProductImageUploader'

const secondStepFormSchema = z.object({
    images: z.array(z.string()).min(1, { message: 'Vui lòng chọn ít nhất một ảnh sản phẩm.' })
})

export type SecondStepData = z.infer<typeof secondStepFormSchema>

type AddProductFormSecondStepProps = {
    defaultValues: SecondStepData | null
    onNext: (values: SecondStepData) => void
    onPrev: () => void
}

const AddProductFormSecondStep = ({ defaultValues, onNext, onPrev }: AddProductFormSecondStepProps) => {
    const form = useForm<SecondStepData>({
        resolver: zodResolver(secondStepFormSchema),
        defaultValues: defaultValues ?? {
            images: []
        }
    })

    const onSubmit = (values: SecondStepData) => {
        onNext(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid gap-2">
                    <FormLabel className="text-card-foreground">Ảnh sản phẩm</FormLabel>
                    <div className="grid grid-cols-3 gap-4 lg:grid-cols-4 xl:grid-cols-5">
                        {form.watch('images').map(image => (
                            <div
                                key={image}
                                className="border-primary relative flex w-full items-center justify-center rounded-xl border-4 p-1"
                            >
                                <img
                                    src={image}
                                    className="bg-primary-foreground aspect-square h-full w-full rounded-lg object-cover"
                                />

                                <Button
                                    className="absolute right-2 bottom-2"
                                    variant="destructive"
                                    type="button"
                                    size="icon"
                                    onClick={() => {
                                        form.setValue(
                                            'images',
                                            form.getValues('images').filter(img => img !== image)
                                        )
                                    }}
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        ))}

                        <ProductImageUploader
                            setImage={image => form.setValue('images', [...form.getValues('images'), image])}
                        />
                    </div>
                    {form.formState.errors.images && (
                        <p className="text-destructive text-sm">{form.formState.errors.images.message}</p>
                    )}
                </div>

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

export default AddProductFormSecondStep
