import { useState } from 'react'
import { UseMutationResult } from '@tanstack/react-query'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import ValidationDialog from '@/features/order/components/ValidationDialog'

type ProcessOrderDialogProps = {
    order: IOrder | null
    open: boolean
    setOpen: (value: boolean) => void
    updateStatusMutation: UseMutationResult<
        any,
        any,
        { orderId: number; data: { statusId: number; explanation?: string } },
        any
    >
}

const ProcessOrderDialog = ({ order, open, setOpen, updateStatusMutation }: ProcessOrderDialogProps) => {
    const [selectedStatus, setSelectedStatus] = useState<IOrderStatus | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [isExplanationRequired, setIsExplanationRequired] = useState(false)
    const [isScanningRequired, setIsScanningRequired] = useState(false)

    if (!order) return null

    const handleProcessOrder = async (newStatus: number, explanation: string | undefined) => {
        const data: { statusId: number; explanation?: string } = { statusId: newStatus }
        if (explanation) {
            data.explanation = explanation
        }

        await updateStatusMutation
            .mutateAsync({
                orderId: order.orderId,
                data: data
            })
            .then(() => {
                setDialogOpen(false)
                setOpen(false)
            })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Xử lý đơn hàng</DialogTitle>
                    <DialogDescription>
                        Cập nhật trạng thái và thêm cách thông tin cần thiết cho đơn hàng.
                    </DialogDescription>
                </DialogHeader>
                <Separator />

                <ValidationDialog
                    isExplanationRequired={isExplanationRequired}
                    isScanningRequired={isScanningRequired}
                    orderItems={order.orderItems}
                    selectedStatus={selectedStatus}
                    open={dialogOpen}
                    setOpen={setDialogOpen}
                    onSubmit={handleProcessOrder}
                    isLoading={updateStatusMutation.isPending}
                />

                <div className="flex flex-col gap-4">
                    {order.availableTransitions.length === 0 && (
                        <p className="text-muted-foreground text-sm">
                            Không có hướng chuyển trạng thái nào khả dụng cho đơn hàng này.
                        </p>
                    )}

                    {order.availableTransitions.length > 0 &&
                        order.availableTransitions.map(item => {
                            if (item.isScanningRequired || item.toStatus?.isExplanationRequired) {
                                return (
                                    <Button
                                        key={item.toStatusId}
                                        size="lg"
                                        variant="ghost"
                                        className="text-primary-foreground hover:text-primary-foreground/80 rounded"
                                        style={{
                                            backgroundColor: item.toStatus?.color
                                        }}
                                        onClick={() => {
                                            setSelectedStatus(item.toStatus as IOrderStatus)
                                            setIsExplanationRequired(item.toStatus!.isExplanationRequired!)
                                            setIsScanningRequired(item.isScanningRequired)
                                            setDialogOpen(true)
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                )
                            } else {
                                return (
                                    <ConfirmationDialog
                                        key={item.toStatusId}
                                        title="Bạn có chắc muốn cập nhật trạng thái này?"
                                        description="Không thể hoàn tác hành động này."
                                        onConfirm={() => handleProcessOrder(item.toStatusId, undefined)}
                                        trigger={
                                            <Button
                                                size="lg"
                                                variant="ghost"
                                                className="text-primary-foreground hover:text-primary-foreground/80 rounded"
                                                style={{
                                                    backgroundColor: item.toStatus?.color
                                                }}
                                            >
                                                {item.label}
                                            </Button>
                                        }
                                    />
                                )
                            }
                        })}
                </div>
                <Separator />

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Đóng</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ProcessOrderDialog
