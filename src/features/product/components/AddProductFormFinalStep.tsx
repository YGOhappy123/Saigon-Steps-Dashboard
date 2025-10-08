import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { AddProductData } from '@/features/product/pages/AddProductPage'
import { SHOE_GENDER_MAP } from '@/configs/constants'
import formatCurrency from '@/utils/formatCurrency'

type AddProductFormFinalStepProps = {
    data: AddProductData
    brands: IProductBrand[]
    categories: IShoeCategory[]
    onConfirm: (values: AddProductData) => Promise<void>
    onPrev: () => void
    isLoading: boolean
    formSteps: {
        title: string
        description: string
    }[]
}

const AddProductFormFinalStep = ({
    data,
    brands,
    categories,
    onConfirm,
    onPrev,
    isLoading,
    formSteps
}: AddProductFormFinalStepProps) => {
    return (
        <div>
            <Accordion type="multiple" className="w-full" defaultValue={['item-1']}>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                        <div className="flex flex-col">
                            <h4 className="text-lg font-semibold">1. {formSteps[0].title}</h4>
                            <span className="text-muted-foreground text-sm">{formSteps[0].description}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-2 gap-4 p-4">
                            <div className="text-justify">
                                <span className="text-card-foreground font-medium">1.1. Tên sản phẩm: </span>
                                {data.name}
                            </div>
                            <div className="text-justify">
                                <span className="text-card-foreground font-medium">1.2. Thương hiệu: </span>
                                {brands.find(brand => brand.brandId === data.brandId)?.name}
                            </div>
                            <div className="text-justify">
                                <span className="text-card-foreground font-medium">1.3. Loại sản phẩm: </span>
                                {data.type === 'shoe' ? 'Giày / dép' : 'Phụ kiện'}
                            </div>
                            <div className="text-justify">
                                <span className="text-card-foreground font-medium">1.4. Giá tiền (VNĐ): </span>
                                {formatCurrency(data.price)}
                            </div>
                            <div className="col-span-2">
                                <span className="text-card-foreground font-medium">1.5. Mô tả: </span>
                                <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                        <div className="flex flex-col">
                            <h4 className="text-lg font-semibold">2. {formSteps[1].title}</h4>
                            <span className="text-muted-foreground text-sm">{formSteps[1].description}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-3 gap-4 p-4 lg:grid-cols-4 xl:grid-cols-5">
                            {data.images.map(image => (
                                <div
                                    key={image}
                                    className="border-primary flex w-full items-center justify-center rounded-xl border-4 p-1"
                                >
                                    <img
                                        src={image}
                                        className="bg-primary-foreground aspect-square h-full w-full rounded-lg object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {data.type === 'shoe' && (
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                            <div className="flex flex-col">
                                <h4 className="text-lg font-semibold">3. Đặc trưng của giày / dép</h4>
                                <span className="text-muted-foreground text-sm">Các thông số của giày / dép</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-2 gap-4 p-4">
                                <div className="text-justify">
                                    <span className="text-card-foreground font-medium">3.1. Danh mục: </span>
                                    {
                                        categories.find(category => category.categoryId === data.features.categoryId)
                                            ?.name
                                    }
                                </div>
                                <div className="text-justify">
                                    <span className="text-card-foreground font-medium">3.2. Giới tính: </span>
                                    {SHOE_GENDER_MAP[data.features.gender as keyof typeof SHOE_GENDER_MAP]}
                                </div>
                                {[
                                    { name: 'upperMaterial', label: 'Chất liệu thân' },
                                    { name: 'soleMaterial', label: 'Chất liệu đế' },
                                    { name: 'liningMaterial', label: 'Chất liệu lót' },
                                    { name: 'closureType', label: 'Kiểu khóa' },
                                    { name: 'toeShape', label: 'Hình dạng mũi giày' },
                                    { name: 'waterResistant', label: 'Khả năng chống nước' },
                                    { name: 'breathability', label: 'Độ thoáng khí' },
                                    { name: 'pattern', label: 'Họa tiết' },
                                    { name: 'countryOfOrigin', label: 'Quốc gia xuất xứ' },
                                    { name: 'heelHeight', label: 'Chiều cao gót (cm)' },
                                    { name: 'durabilityRating', label: 'Độ bền (thang 10)' },
                                    { name: 'releaseYear', label: 'Năm phát hành' }
                                ].map((item, index) => (
                                    <div className="text-justify">
                                        <span className="text-card-foreground font-medium">
                                            3.{index + 3}. {item.label}:{' '}
                                        </span>
                                        {data.features[item.name as keyof typeof data.features]}
                                    </div>
                                ))}
                                <div className="flex items-center gap-1 text-justify">
                                    <span className="text-card-foreground font-medium">3.15. Màu sắc chủ đạo: </span>
                                    <div
                                        className="border-primary ml-2 h-6 w-15 rounded-sm border-2"
                                        style={{ backgroundColor: data.features.primaryColor }}
                                    ></div>
                                </div>
                                <div className="flex items-center gap-1 text-justify">
                                    <span className="text-card-foreground font-medium">3.16. Màu sắc phụ: </span>
                                    {data.features.secondaryColor ? (
                                        <div
                                            className="border-primary ml-2 h-6 w-15 rounded-sm border-2"
                                            style={{ backgroundColor: data.features.secondaryColor }}
                                        ></div>
                                    ) : (
                                        '(Không có)'
                                    )}
                                </div>
                                <div className="col-span-2 flex items-center gap-3">
                                    <span className="text-card-foreground font-medium">3.17. Dịp sử dụng: </span>
                                    <div className="flex flex-wrap gap-2">
                                        {data.features.occasionTags.map(tag => (
                                            <div
                                                key={tag}
                                                className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 select-none"
                                            >
                                                <span className="font-semibold text-blue-600">{tag}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-2 flex items-center gap-3">
                                    <span className="text-card-foreground font-medium">
                                        3.18. Phong cách thiết kế:{' '}
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {data.features.designTags.map(tag => (
                                            <div
                                                key={tag}
                                                className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 select-none"
                                            >
                                                <span className="font-semibold text-blue-600">{tag}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-2 flex items-center gap-3">
                                    <span className="text-card-foreground font-medium">3.19. Kích thước: </span>
                                    <div className="flex flex-wrap gap-2">
                                        {data.sizes.map(size => (
                                            <div
                                                key={size}
                                                className="flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1 select-none"
                                            >
                                                <span className="font-semibold text-pink-600">{size}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>

            <div className="mt-6 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={onPrev}
                    className="h-12 rounded text-base capitalize"
                >
                    Quay về bước trước
                </Button>
                <Button
                    disabled={isLoading}
                    onClick={() => {
                        if (!isLoading) onConfirm(data)
                    }}
                    className="h-12 rounded text-base capitalize"
                >
                    {isLoading ? 'Đang tải...' : 'Tạo sản phẩm'}
                </Button>
            </div>
        </div>
    )
}

export default AddProductFormFinalStep
