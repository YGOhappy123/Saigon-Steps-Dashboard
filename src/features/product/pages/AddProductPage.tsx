import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { RootState } from '@/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import productService, { CreateProductDto } from '@/features/product/services/productService'
import AddProductFormFirstStep, { FirstStepData } from '@/features/product/components/AddProductFormFirstStep'
import AddProductFormSecondStep, { SecondStepData } from '@/features/product/components/AddProductFormSecondStep'
import AddProductFormFinalStep from '@/features/product/components/AddProductFormFinalStep'
import MultistepsFormSteps from '@/components/common/MultistepsFormSteps'
import useAxiosIns from '@/hooks/useAxiosIns'
import fileService from '@/services/fileService'

export type AddProductData = FirstStepData & SecondStepData

const formSteps = [
    {
        title: 'Thông tin cơ bản',
        description: 'Định nghĩa các thông tin cơ bản cho sản phẩm.'
    },
    {
        title: 'Hình ảnh sản phẩm',
        description: 'Tải lên các hình ảnh minh họa cho sản phẩm.'
    },
    {
        title: 'Kiểm tra',
        description: 'Tổng hợp thông tin trước khi tiến hành tạo sản phẩm.'
    }
]

const AddProductPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const axios = useAxiosIns()
    const [step, setStep] = useState(0)
    const [firstStepData, setFirstStepData] = useState<FirstStepData | null>(null)
    const [secondStepData, setSecondStepData] = useState<SecondStepData | null>(null)

    const { uploadBase64Mutation } = fileService()
    const { addNewProductMutation } = productService({ enableFetching: false })

    const handleSubmit = async (values: AddProductData) => {
        const images = await Promise.all(
            values.images.map(async image => {
                if (image.startsWith('data:')) {
                    const resImage = await uploadBase64Mutation.mutateAsync({ base64: image, folder: 'product' })
                    const newImageUrl = resImage.data.data?.imageUrl
                    return newImageUrl
                }
            })
        )

        const data: CreateProductDto = {
            name: values.name,
            brandId: values.brandId,
            price: values.price,
            description: values.description,
            isAccessory: values.type === 'accessory',
            images: images
        }
        if (values.type === 'shoe') {
            data.sizes = values.sizes
            data.features = { ...values.features }
            if (!data.features.secondaryColor) delete data.features.secondaryColor
        }

        await addNewProductMutation.mutateAsync(data)

        setFirstStepData(null)
        setSecondStepData(null)
        setStep(0)
    }

    const getBrandsQuery = useQuery({
        queryKey: ['brands-all'],
        queryFn: () => axios.get<IResponseData<IProductBrand[]>>('/brands'),
        enabled: true,
        select: res => res.data
    })
    const brands = getBrandsQuery.data?.data ?? []

    const getCategoriesQuery = useQuery({
        queryKey: ['categories-all'],
        queryFn: () => axios.get<IResponseData<IShoeCategory[]>>('/categories'),
        enabled: true,
        select: res => res.data
    })
    const categories = getCategoriesQuery.data?.data ?? []

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">
                        Đây là các bước cần thiết để tạo một sản phẩm mới trên hệ thống Saigon Steps.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                    </Avatar>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6">
                <MultistepsFormSteps formSteps={formSteps} currentStep={step} />

                <Card className="w-full max-w-4xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Tạo sản phẩm mới</CardTitle>
                        <CardDescription>{formSteps[step].description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === 0 && (
                            <AddProductFormFirstStep
                                defaultValues={firstStepData}
                                brands={brands}
                                categories={categories}
                                onNext={values => {
                                    setFirstStepData(values)
                                    setStep(1)
                                }}
                            />
                        )}
                        {step === 1 && (
                            <AddProductFormSecondStep
                                defaultValues={secondStepData}
                                onNext={values => {
                                    setSecondStepData(values)
                                    setStep(2)
                                }}
                                onPrev={() => setStep(0)}
                            />
                        )}
                        {step === 2 && firstStepData != null && secondStepData != null && (
                            <AddProductFormFinalStep
                                data={{ ...firstStepData, ...secondStepData }}
                                brands={brands}
                                categories={categories}
                                formSteps={formSteps}
                                onConfirm={async values => handleSubmit(values)}
                                onPrev={() => setStep(1)}
                                isLoading={addNewProductMutation.isPending || uploadBase64Mutation.isPending}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AddProductPage
