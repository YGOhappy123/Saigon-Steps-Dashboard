import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { RootState } from '@/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import damageService, { CreateDamageDto } from '@/features/damageReport/services/damageService'
import AddDamageFormFirstStep, { FirstStepData } from '@/features/damageReport/components/AddDamageFormFirstStep'
import AddDamageFormSecondStep, { SecondStepData } from '@/features/damageReport/components/AddDamageFormSecondStep'
import AddDamageFormFinalStep from '@/features/damageReport/components/AddDamageFormFinalStep'
import MultistepsFormSteps from '@/components/common/MultistepsFormSteps'
import useAxiosIns from '@/hooks/useAxiosIns'

export type AddDamageData = FirstStepData & SecondStepData

export const formSteps = [
    {
        title: 'Thông tin cơ bản',
        description: 'Định nghĩa các thông tin cơ bản cho báo cáo thiệt hại.'
    },
    {
        title: 'Thông tin sản phẩm',
        description: 'Định nghĩa các thông tin sản phẩm cho báo cáo thiệt hại.'
    },
    {
        title: 'Kiểm tra',
        description: 'Tổng hợp thông tin trước khi tiến hành tạo báo cáo thiệt hại.'
    }
]

const AddDamagePage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const axios = useAxiosIns()
    const [step, setStep] = useState(0)
    const [firstStepData, setFirstStepData] = useState<FirstStepData | null>(null)
    const [secondStepData, setSecondStepData] = useState<SecondStepData | null>(null)
    const { reportNewDamageMutation } = damageService({ enableFetching: false })

    const handleSubmit = async (values: AddDamageData) => {
        const data: CreateDamageDto = {
            ...values,
            items: values.items.map(ii => ({
                productItemId: ii.productItemId,
                expectedCost: ii.expectedCost,
                quantity: ii.quantity
            }))
        }
        if (!data.note) delete data.note

        await reportNewDamageMutation.mutateAsync(data)

        setFirstStepData(null)
        setSecondStepData(null)
        setStep(0)
    }

    const fetchAllProductsQuery = useQuery({
        queryKey: ['products-all'],
        queryFn: () => axios.get<IResponseData<IRootProduct[]>>('/products'),
        enabled: true,
        select: res => res.data
    })
    const products = fetchAllProductsQuery.data?.data || []

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.name}!</h2>
                    <p className="text-muted-foreground">
                        Đây là các bước cần thiết để tạo một báo cáo thiệt hại mới trên hệ thống Saigon Steps.
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
                        <CardTitle className="text-xl">Tạo báo cáo thiệt hại mới</CardTitle>
                        <CardDescription>{formSteps[step].description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === 0 && (
                            <AddDamageFormFirstStep
                                defaultValues={firstStepData}
                                onNext={values => {
                                    setFirstStepData(values)
                                    setStep(1)
                                }}
                            />
                        )}
                        {step === 1 && (
                            <AddDamageFormSecondStep
                                defaultValues={secondStepData}
                                rootProducts={products}
                                onNext={values => {
                                    setSecondStepData(values)
                                    setStep(2)
                                }}
                                onPrev={() => setStep(0)}
                            />
                        )}
                        {step === 2 && firstStepData != null && secondStepData != null && (
                            <AddDamageFormFinalStep
                                data={{ ...firstStepData, ...secondStepData }}
                                rootProducts={products}
                                onConfirm={async values => handleSubmit(values)}
                                onPrev={() => setStep(1)}
                                isLoading={false}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AddDamagePage
