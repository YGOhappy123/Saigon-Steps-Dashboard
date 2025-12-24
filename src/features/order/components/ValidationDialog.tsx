import { useState } from 'react'
import { PencilLine } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import BarcodeScanningSection from '@/features/order/components/BarcodeScanningSection'

type ScanBarcodeDialogProps = {
    isExplanationRequired: boolean
    isScanningRequired: boolean
    orderItems: IOrder['orderItems']
    selectedStatus: IOrderStatus | null
    open: boolean
    setOpen: (value: boolean) => void
    onSubmit: (newStatus: number, explanation?: string) => Promise<void>
    isLoading: boolean
}

const ValidationDialog = ({
    isExplanationRequired,
    isScanningRequired,
    orderItems,
    selectedStatus,
    open,
    setOpen,
    onSubmit,
    isLoading
}: ScanBarcodeDialogProps) => {
    const [explanation, setExplanation] = useState('')
    const [isBarcodeSubmittable, setIsBarcodeSubmittable] = useState(!isScanningRequired)

    const handleSubmit = async () => {
        if (selectedStatus == null) return
        await onSubmit(selectedStatus.statusId, isExplanationRequired && explanation.trim() ? explanation : undefined)
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="min-w-2xl md:min-w-3xl xl:min-w-4xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Quét mã vạch để cập nhật trạng thái đơn hàng</AlertDialogTitle>
                    <AlertDialogDescription>
                        Trạng thái đơn hàng này yêu cầu quét mã vạch của sản phẩm. Vui lòng sử dụng camera để quét mã
                        vạch và xác nhận cập nhật trạng thái.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Separator />

                {isExplanationRequired && (
                    <ExplanationSection
                        label={selectedStatus?.explanationLabel || ''}
                        explanation={explanation}
                        setExplanation={setExplanation}
                    />
                )}

                {isScanningRequired && (
                    <BarcodeScanningSection
                        orderItems={orderItems}
                        open={open}
                        setIsBarcodeSubmittable={setIsBarcodeSubmittable}
                    />
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Đóng</Button>
                    </AlertDialogCancel>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading || (isExplanationRequired && !explanation) || !isBarcodeSubmittable}
                        className="ml-2"
                    >
                        <PencilLine />
                        Xác nhận
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

type ExplanationSectionProps = {
    label: string
    explanation: string
    setExplanation: (value: string) => void
}

const ExplanationSection = ({ label, explanation, setExplanation }: ExplanationSectionProps) => {
    return (
        <>
            <Input
                placeholder={`Nhập ${label.toLowerCase()}`}
                className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
            />
            <Separator />
        </>
    )
}

export default ValidationDialog
