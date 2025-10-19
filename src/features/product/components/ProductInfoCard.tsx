import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CirclePlus, PencilLine, Trash2 } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { sections } from '@/features/product/components/TableOfContents'
import { getProductSlug } from '@/utils/getProductSlug'
import { SHOE_GENDER_OPTIONS } from '@/configs/constants'
import productService, { UpdateProductInfoDto } from '@/features/product/services/productService'
import RichTextEditor from '@/components/common/RichTextEditor'
import ProductImageUploader from '@/features/product/components/ProductImageUploader'
import TagInputField from '@/features/product/components/TagInputField'
import fileService from '@/services/fileService'
import striptags from 'striptags'

const baseInfoFormSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Tên sản phẩm không được để trống.' })
        .refine(val => getProductSlug(val).length > 0, {
            message: 'Tên sản phẩm không hợp lệ vì làm chuỗi slug bị trống.'
        }),
    description: z
        .string()
        .min(1, { message: 'Mô tả sản phẩm không được để trống.' })
        .refine(val => striptags(val).length > 0, {
            message: 'Mô tả sản phẩm không được để trống.'
        }),
    brandId: z.number().min(1, { message: 'Vui lòng chọn thương hiệu.' }),
    images: z.array(z.string()).min(1, { message: 'Vui lòng chọn ít nhất một ảnh sản phẩm.' })
})

const shoeProductSchema = baseInfoFormSchema.extend({
    type: z.literal('shoe'),
    features: z.object({
        categoryId: z.number().min(1, { message: 'Vui lòng chọn danh mục.' }),
        gender: z.enum(['MALE', 'FEMALE', 'UNISEX'], { message: 'Giới tính không được để trống.' }),
        upperMaterial: z.string().min(1, { message: 'Chất liệu thân không được để trống.' }),
        soleMaterial: z.string().min(1, { message: 'Chất liệu đế không được để trống.' }),
        liningMaterial: z.string().min(1, { message: 'Chất liệu lót không được để trống.' }),
        closureType: z.string().min(1, { message: 'Kiểu khóa không được để trống.' }),
        toeShape: z.string().min(1, { message: 'Hình dạng mũi giày không được để trống.' }),
        waterResistant: z.string().min(1, { message: 'Khả năng chống nước không được để trống.' }),
        breathability: z.string().min(1, { message: 'Độ thoáng khí không được để trống.' }),
        pattern: z.string().min(1, { message: 'Họa tiết không được để trống.' }),
        countryOfOrigin: z.string().min(1, { message: 'Quốc gia xuất xứ không được để trống.' }),
        heelHeight: z.coerce.number().min(0, { message: 'Chiều cao gót không được để trống.' }),
        durabilityRating: z.coerce
            .number()
            .min(1, { message: 'Độ bền không được nhỏ hơn 1.' })
            .max(10, { message: 'Độ bền không được lớn hơn 10.' }),
        releaseYear: z.coerce
            .number()
            .min(1900, { message: 'Năm phát hành không được nhỏ hơn 1900.' })
            .refine(value => value <= new Date().getFullYear(), {
                message: 'Năm phát hành không được lớn hơn năm hiện tại.'
            }),
        primaryColor: z.string().min(1, { message: 'Màu sắc chủ đạo không được để trống.' }),
        secondaryColor: z.string().optional(),
        occasionTags: z.array(z.string()).min(1, { message: 'Vui lòng chọn ít nhất một thẻ dịp sử dụng.' }),
        designTags: z.array(z.string()).min(1, { message: 'Vui lòng chọn ít nhất một thẻ thiết kế.' })
    })
})

const accessoryProductSchema = baseInfoFormSchema.extend({
    type: z.literal('accessory')
})

const productInfoFormSchema = z.discriminatedUnion('type', [shoeProductSchema, accessoryProductSchema])

type ProductInfoCardProps = {
    product: IRootProduct
    brands: IProductBrand[]
    categories: IShoeCategory[]
    hasModifyInfoPermission: boolean
    onUpdateSuccess: () => Promise<any>
}

const ProductInfoCard = ({
    product,
    brands,
    categories,
    hasModifyInfoPermission,
    onUpdateSuccess
}: ProductInfoCardProps) => {
    const section = sections.information
    const [mode, setMode] = useState<'view' | 'update'>('view')
    const { uploadBase64Mutation } = fileService()
    const { updateProductInfoMutation } = productService({ enableFetching: false })

    const form = useForm<z.infer<typeof productInfoFormSchema>>({
        resolver: zodResolver(productInfoFormSchema) as any,
        defaultValues: {
            type: product.isAccessory ? 'accessory' : 'shoe',
            name: product.name,
            description: product.description,
            brandId: product.brandId,
            images: product.images as string[],
            features: {
                categoryId: product.shoeFeature?.categoryId,
                gender: product.shoeFeature?.gender,
                upperMaterial: product.shoeFeature?.upperMaterial,
                soleMaterial: product.shoeFeature?.soleMaterial,
                liningMaterial: product.shoeFeature?.liningMaterial,
                closureType: product.shoeFeature?.closureType,
                toeShape: product.shoeFeature?.toeShape,
                waterResistant: product.shoeFeature?.waterResistant,
                breathability: product.shoeFeature?.breathability,
                pattern: product.shoeFeature?.pattern,
                countryOfOrigin: product.shoeFeature?.countryOfOrigin,
                heelHeight: product.shoeFeature?.heelHeight,
                durabilityRating: product.shoeFeature?.durabilityRating,
                releaseYear: product.shoeFeature?.releaseYear,
                primaryColor: product.shoeFeature?.primaryColor,
                secondaryColor: product.shoeFeature?.secondaryColor ?? undefined,
                occasionTags: product.shoeFeature?.occasionTags || [],
                designTags: product.shoeFeature?.designTags || []
            }
        }
    })

    const onSubmit = async (values: z.infer<typeof productInfoFormSchema>) => {
        if (!hasModifyInfoPermission) return

        try {
            const newImages = await Promise.all(
                values.images.map(async image => {
                    if (image.startsWith('data:')) {
                        const resImage = await uploadBase64Mutation.mutateAsync({ base64: image, folder: 'product' })
                        const newImageUrl = resImage.data.data?.imageUrl
                        return newImageUrl
                    } else {
                        return image
                    }
                })
            )

            const data: UpdateProductInfoDto = {
                name: values.name,
                description: values.description,
                brandId: values.brandId,
                images: newImages
            }
            if (values.type === 'shoe') {
                data.features = { ...values.features }
                if (!data.features.secondaryColor) delete data.features.secondaryColor
            }

            await updateProductInfoMutation.mutateAsync({
                productId: product.rootProductId,
                data: data
            })

            onUpdateSuccess()
            setMode('view')
        } catch {
            form.reset()
        }
    }

    useEffect(() => {
        form.reset({
            type: product.isAccessory ? 'accessory' : 'shoe',
            name: product.name,
            description: product.description,
            brandId: product.brandId,
            images: product.images as string[],
            features: {
                categoryId: (product.shoeFeature as IShoeFeature)?.categoryId,
                gender: (product.shoeFeature as IShoeFeature)?.gender,
                upperMaterial: (product.shoeFeature as IShoeFeature)?.upperMaterial,
                soleMaterial: (product.shoeFeature as IShoeFeature)?.soleMaterial,
                liningMaterial: (product.shoeFeature as IShoeFeature)?.liningMaterial,
                closureType: (product.shoeFeature as IShoeFeature)?.closureType,
                toeShape: (product.shoeFeature as IShoeFeature)?.toeShape,
                waterResistant: (product.shoeFeature as IShoeFeature)?.waterResistant,
                breathability: (product.shoeFeature as IShoeFeature)?.breathability,
                pattern: (product.shoeFeature as IShoeFeature)?.pattern,
                countryOfOrigin: (product.shoeFeature as IShoeFeature)?.countryOfOrigin,
                heelHeight: (product.shoeFeature as IShoeFeature)?.heelHeight,
                durabilityRating: (product.shoeFeature as IShoeFeature)?.durabilityRating,
                releaseYear: (product.shoeFeature as IShoeFeature)?.releaseYear,
                primaryColor: (product.shoeFeature as IShoeFeature)?.primaryColor,
                secondaryColor: (product.shoeFeature as IShoeFeature)?.secondaryColor ?? undefined,
                occasionTags: (product.shoeFeature as IShoeFeature)?.occasionTags || [],
                designTags: (product.shoeFeature as IShoeFeature)?.designTags || []
            }
        })
    }, [product, form])

    return (
        <Card className="w-full max-w-4xl" id={section.id}>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <CardDescription>
                    {hasModifyInfoPermission
                        ? 'Cập nhật thông tin sản phẩm bẳng cách ấn vào nút "Chỉnh sửa" tại mục này'
                        : 'Tài khoản của bạn không được cấp quyền cập nhật thông tin sản phẩm'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Tên sản phẩm</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={!hasModifyInfoPermission || mode === 'view'}
                                                placeholder="Tên sản phẩm..."
                                                className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid gap-2">
                                <FormLabel className="text-card-foreground">Chuỗi slug</FormLabel>
                                <Input
                                    disabled
                                    name="slug"
                                    placeholder="Chuỗi slug..."
                                    className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                                    value={getProductSlug(form.watch('name'))}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="brandId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Thương hiệu</FormLabel>
                                            <Select
                                                onValueChange={value => field.onChange(Number(value))}
                                                value={field.value.toString()}
                                                disabled={!hasModifyInfoPermission || mode === 'view'}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                        <SelectValue placeholder="Thương hiệu..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {brands.map(brand => (
                                                        <SelectItem
                                                            key={brand.brandId}
                                                            value={brand.brandId.toString()}
                                                        >
                                                            {brand.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid gap-2">
                                    <FormLabel className="text-card-foreground">Loại sản phẩm</FormLabel>
                                    <Select
                                        onValueChange={() => {}}
                                        defaultValue={product.isAccessory ? 'accessory' : 'shoe'}
                                        disabled
                                    >
                                        <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                            <SelectValue placeholder="Chọn loại sản phẩm..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="accessory" disabled>
                                                Phụ kiện
                                            </SelectItem>
                                            <SelectItem value="shoe" disabled>
                                                Giày / dép
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Mô tả sản phẩm</FormLabel>
                                        <FormControl>
                                            <RichTextEditor
                                                disabled={!hasModifyInfoPermission || mode === 'view'}
                                                content={field.value}
                                                onChange={field.onChange}
                                                containerClassName="rounded border-2"
                                                editorClassName="caret-card-foreground text-card-foreground"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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

                                            {hasModifyInfoPermission && mode === 'update' && (
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
                                            )}
                                        </div>
                                    ))}

                                    {hasModifyInfoPermission && mode === 'update' && (
                                        <ProductImageUploader
                                            setImage={image =>
                                                form.setValue('images', [...form.getValues('images'), image])
                                            }
                                        />
                                    )}
                                </div>
                                {form.formState.errors.images && (
                                    <p className="text-destructive text-sm">{form.formState.errors.images.message}</p>
                                )}
                            </div>

                            {form.watch('type') === 'shoe' && (
                                <div className="grid grid-cols-2 items-start gap-x-4 gap-y-6">
                                    <FormField
                                        control={form.control}
                                        name="features.categoryId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-card-foreground">Danh mục</FormLabel>
                                                <Select
                                                    onValueChange={value => field.onChange(Number(value))}
                                                    value={field.value.toString()}
                                                    disabled={!hasModifyInfoPermission || mode === 'view'}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                            <SelectValue placeholder="Danh mục..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map(category => (
                                                            <SelectItem
                                                                key={category.categoryId}
                                                                value={category.categoryId.toString()}
                                                            >
                                                                {category.name}
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
                                        name="features.gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-card-foreground">Giới tính</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    disabled={!hasModifyInfoPermission || mode === 'view'}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                            <SelectValue placeholder="Danh mục..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {SHOE_GENDER_OPTIONS.map(gender => (
                                                            <SelectItem key={gender.value} value={gender.value}>
                                                                {gender.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {[
                                        { name: 'upperMaterial', label: 'Chất liệu thân', type: 'text' },
                                        { name: 'soleMaterial', label: 'Chất liệu đế', type: 'text' },
                                        { name: 'liningMaterial', label: 'Chất liệu lót', type: 'text' },
                                        { name: 'closureType', label: 'Kiểu khóa', type: 'text' },
                                        { name: 'toeShape', label: 'Hình dạng mũi giày', type: 'text' },
                                        { name: 'waterResistant', label: 'Khả năng chống nước', type: 'text' },
                                        { name: 'breathability', label: 'Độ thoáng khí', type: 'text' },
                                        { name: 'pattern', label: 'Họa tiết', type: 'text' },
                                        { name: 'countryOfOrigin', label: 'Quốc gia xuất xứ', type: 'text' },
                                        { name: 'heelHeight', label: 'Chiều cao gót (cm)', type: 'number' },
                                        { name: 'durabilityRating', label: 'Độ bền (thang 10)', type: 'number' },
                                        { name: 'releaseYear', label: 'Năm phát hành', type: 'number' },
                                        { name: 'primaryColor', label: 'Màu sắc chủ đạo', type: 'color' }
                                    ].map(feature => (
                                        <FormField
                                            key={feature.name}
                                            control={form.control}
                                            name={`features.${feature.name}` as any}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-card-foreground">
                                                        {feature.label}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={!hasModifyInfoPermission || mode === 'view'}
                                                            placeholder={`${feature.label}...`}
                                                            className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                                                            type={feature.type}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                    <FormField
                                        control={form.control}
                                        name="features.secondaryColor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-card-foreground">Màu sắc phụ</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-2">
                                                        {form.watch('features.secondaryColor') ? (
                                                            <>
                                                                <Input
                                                                    disabled={
                                                                        !hasModifyInfoPermission || mode === 'view'
                                                                    }
                                                                    placeholder="Màu sắc phụ..."
                                                                    className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                                                                    type="color"
                                                                    {...field}
                                                                />
                                                                <Button
                                                                    disabled={
                                                                        !hasModifyInfoPermission || mode === 'view'
                                                                    }
                                                                    type="button"
                                                                    variant="destructive"
                                                                    onClick={() => field.onChange(undefined)}
                                                                    className="h-12 rounded text-base capitalize xl:col-span-2"
                                                                >
                                                                    <Trash2 />
                                                                    Xóa màu phụ
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Button
                                                                disabled={!hasModifyInfoPermission || mode === 'view'}
                                                                type="button"
                                                                onClick={() => field.onChange('#000000')}
                                                                className="h-12 flex-1 rounded text-base capitalize xl:col-span-2"
                                                            >
                                                                <CirclePlus />
                                                                Thêm màu phụ
                                                            </Button>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <TagInputField
                                        className="col-span-2"
                                        label="Dịp sử dụng"
                                        value={form.watch('features.occasionTags')}
                                        onChange={tags => form.setValue('features.occasionTags', tags)}
                                        editable={hasModifyInfoPermission && mode === 'update'}
                                        placeholder="Dịp sử dụng..."
                                        errorMessage={
                                            Object.keys(form.formState.errors).length > 0 &&
                                            form.watch('features.occasionTags').length === 0
                                                ? 'Vui lòng chọn ít nhất một thẻ dịp sử dụng.'
                                                : undefined
                                        }
                                    />
                                    <TagInputField
                                        className="col-span-2"
                                        label="Phong cách thiết kế"
                                        value={form.watch('features.designTags')}
                                        onChange={tags => form.setValue('features.designTags', tags)}
                                        editable={hasModifyInfoPermission && mode === 'update'}
                                        placeholder="Phong cách thiết kế..."
                                        errorMessage={
                                            Object.keys(form.formState.errors).length > 0 &&
                                            form.watch('features.designTags').length === 0
                                                ? 'Vui lòng chọn ít nhất một thẻ thiết kế.'
                                                : undefined
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        {hasModifyInfoPermission && (
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
                                            disabled={!hasModifyInfoPermission || form.formState.isSubmitting}
                                            className="h-12 rounded text-base capitalize"
                                        >
                                            {form.formState.isSubmitting ? 'Đang tải...' : 'Cập nhật thông tin'}
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default ProductInfoCard
