import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CirclePlus, Trash2 } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getProductSlug } from '@/utils/getProductSlug'
import { SHOE_GENDER_OPTIONS } from '@/configs/constants'
import striptags from 'striptags'
import RichTextEditor from '@/components/common/RichTextEditor'
import TagInputField from '@/features/product/components/TagInputField'

const baseInfoFormSchema = z
    .object({
        name: z.string().min(1, { message: 'Tên sản phẩm không được để trống.' }),
        description: z
            .string()
            .min(1, { message: 'Mô tả sản phẩm không được để trống.' })
            .refine(val => striptags(val).length > 0, {
                message: 'Mô tả sản phẩm không được để trống.'
            }),
        brandId: z.number().min(1, { message: 'Vui lòng chọn thương hiệu.' }),
        price: z.coerce.number().min(1000, { message: 'Giá tiền phải lớn hơn 1000 đồng.' })
    })
    .refine(data => data.price % 1000 === 0, {
        message: 'Giá tiền phải là bội số của 1000 đồng.',
        path: ['price']
    })

const shoeProductSchema = baseInfoFormSchema.safeExtend({
    type: z.literal('shoe'),
    sizes: z.array(z.string()).min(1, { message: 'Vui lòng chọn ít nhất một kích thước.' }),
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

const accessoryProductSchema = baseInfoFormSchema.safeExtend({
    type: z.literal('accessory')
})

const firstStepFormSchema = z.discriminatedUnion('type', [shoeProductSchema, accessoryProductSchema])

export type FirstStepData = z.infer<typeof firstStepFormSchema>

type AddProductFormFirstStepProps = {
    defaultValues: FirstStepData | null
    brands: IProductBrand[]
    categories: IShoeCategory[]
    onNext: (values: FirstStepData) => void
}

const AddProductFormFirstStep = ({ defaultValues, brands, categories, onNext }: AddProductFormFirstStepProps) => {
    const form = useForm<FirstStepData>({
        resolver: zodResolver(firstStepFormSchema) as any,
        defaultValues: defaultValues ?? {
            type: 'shoe',
            name: '',
            description: '',
            brandId: 0,
            price: 0,
            sizes: [],
            features: {
                categoryId: 0,
                gender: 'UNISEX',
                upperMaterial: '',
                soleMaterial: '',
                liningMaterial: '',
                closureType: '',
                toeShape: '',
                waterResistant: '',
                breathability: '',
                pattern: '',
                countryOfOrigin: '',
                heelHeight: 0,
                durabilityRating: 0,
                releaseYear: new Date().getFullYear(),
                primaryColor: '#000000',
                secondaryColor: undefined,
                occasionTags: [],
                designTags: []
            }
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Tên sản phẩm</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Tên sản phẩm..."
                                        className="caret-card-foreground text-card-foreground h-12 rounded border-2"
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
                            className="caret-card-foreground text-card-foreground h-12 rounded border-2"
                            value={getProductSlug(form.watch('name'))}
                        />
                    </div>

                    <div className="grid grid-cols-2 items-start gap-4">
                        <FormField
                            control={form.control}
                            name="brandId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Thương hiệu</FormLabel>
                                    <Select
                                        onValueChange={value => field.onChange(Number(value))}
                                        value={field.value.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2">
                                                <SelectValue placeholder="Thương hiệu..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {brands.map(brand => (
                                                <SelectItem key={brand.brandId} value={brand.brandId.toString()}>
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
                                onValueChange={value => form.setValue('type', value as 'accessory' | 'shoe')}
                                defaultValue="shoe"
                            >
                                <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2">
                                    <SelectValue placeholder="Chọn loại sản phẩm..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="accessory">Phụ kiện</SelectItem>
                                    <SelectItem value="shoe">Giày / dép</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Đơn giá (VNĐ)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Đơn giá..."
                                        className="caret-card-foreground text-card-foreground h-12 rounded border-2"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Mô tả sản phẩm</FormLabel>
                                <FormControl>
                                    <RichTextEditor
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
                                        >
                                            <FormControl>
                                                <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2">
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
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2">
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
                                            <FormLabel className="text-card-foreground">{feature.label}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={`${feature.label}...`}
                                                    className="caret-card-foreground text-card-foreground h-12 rounded border-2"
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
                                                            placeholder="Màu sắc phụ..."
                                                            className="caret-card-foreground text-card-foreground h-12 rounded border-2"
                                                            type="color"
                                                            {...field}
                                                        />
                                                        <Button
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
                                editable
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
                                editable
                                placeholder="Phong cách thiết kế..."
                                errorMessage={
                                    Object.keys(form.formState.errors).length > 0 &&
                                    form.watch('features.designTags').length === 0
                                        ? 'Vui lòng chọn ít nhất một thẻ thiết kế.'
                                        : undefined
                                }
                            />
                            <TagInputField
                                className="col-span-2"
                                tagBackgroundColor="bg-pink-100"
                                tagTextColor="text-pink-600"
                                label="Kích thước"
                                value={form.watch('sizes')}
                                onChange={sizes => form.setValue('sizes', sizes)}
                                editable
                                placeholder="Kích thước..."
                                errorMessage={
                                    Object.keys(form.formState.errors).length > 0 && form.watch('sizes').length === 0
                                        ? 'Vui lòng chọn ít nhất một kích thước.'
                                        : undefined
                                }
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                    <Button disabled type="button" variant="outline" className="h-12 rounded text-base capitalize">
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

export default AddProductFormFirstStep
