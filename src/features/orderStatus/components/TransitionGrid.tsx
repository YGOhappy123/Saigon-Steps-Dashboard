import { UseMutationResult } from '@tanstack/react-query'
import { ClockArrowUp, Eraser, FunnelPlus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TransitionGroup } from '@/features/orderStatus/services/transitionService'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'

type TransitionGridProps = {
    orderStatuses: IOrderStatus[]
    statusTransitions: TransitionGroup[]
    hasAddPermission: boolean
    hasDeletePermission: boolean
    onAddTransition: (status: IOrderStatus) => void
    deleteTransitionMutation: UseMutationResult<
        any,
        any,
        {
            fromStatusId: number
            toStatusId: number
        },
        any
    >
}

const TransitionGrid = ({
    orderStatuses,
    statusTransitions,
    hasAddPermission,
    hasDeletePermission,
    onAddTransition,
    deleteTransitionMutation
}: TransitionGridProps) => {
    return (
        <div className="flex flex-col gap-8">
            {orderStatuses.map(status => {
                const matchingGroup = statusTransitions.find(trans => trans.fromStatusId === status.statusId)

                return (
                    <div key={status.statusId}>
                        <div key={status.statusId} className="flex flex-col gap-6">
                            <Card>
                                <CardHeader className="flex items-center justify-between gap-12">
                                    <div className="flex flex-col justify-center gap-1">
                                        <CardTitle className="text-xl">Chi tiết trạng thái đơn hàng</CardTitle>
                                        <CardDescription>Mã trạng thái đơn hàng: {status.statusId}</CardDescription>
                                    </div>
                                    {hasAddPermission && (
                                        <Button type="button" onClick={() => onAddTransition(status)}>
                                            <FunnelPlus />
                                            Thêm hướng chuyển
                                        </Button>
                                    )}
                                </CardHeader>
                                <Separator />
                                <CardContent>
                                    <div className="flex flex-col gap-3">
                                        <p className="line-clamp-1 text-xl font-semibold">
                                            Thông tin trạng thái khởi nguồn
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">Tên trạng thái: </span>
                                            <Badge
                                                style={{
                                                    background: status.color
                                                }}
                                            >
                                                <ClockArrowUp /> {status.name}
                                            </Badge>
                                        </div>
                                        <p>
                                            <span className="font-semibold">Mô tả trạng thái: </span>
                                            <span className="text-muted-foreground">{status.description}</span>
                                        </p>
                                    </div>
                                </CardContent>
                                {matchingGroup && matchingGroup.transitions.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="flex">
                                            <div className="grid flex-1 grid-cols-1 gap-6 px-6 xl:grid-cols-2">
                                                {matchingGroup.transitions.map((transition, index) => (
                                                    <TransitionLine
                                                        key={`${status.statusId}-${transition.toStatusId}-${index}`}
                                                        transition={transition}
                                                        hasDeletePermission={hasDeletePermission}
                                                        onConfirm={async () => {
                                                            await deleteTransitionMutation.mutateAsync({
                                                                fromStatusId: matchingGroup.fromStatusId,
                                                                toStatusId: transition.toStatusId!
                                                            })
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </Card>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

type TransitionLineProps = {
    transition: TransitionGroup['transitions'][number]
    hasDeletePermission: boolean
    onConfirm: () => Promise<void>
}

const TransitionLine = ({ transition, hasDeletePermission, onConfirm }: TransitionLineProps) => {
    return (
        <Card className="relative">
            {hasDeletePermission && (
                <ConfirmationDialog
                    title="Bạn có chắc muốn xóa hướng chuyển trạng thái này?"
                    description="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn hướng chuyển trạng thái khỏi hệ thống Saigon Steps."
                    onConfirm={onConfirm}
                    trigger={
                        <Button variant="destructive" className="absolute top-6 right-6 min-w-[120px]">
                            <Eraser />
                            Xóa
                        </Button>
                    }
                />
            )}
            <CardContent>
                <div className="col-span-2 flex flex-col gap-3">
                    <p className="line-clamp-1 text-xl font-semibold">Chi tiết hướng chuyển trạng thái</p>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Tên trạng thái: </span>
                        <Badge
                            style={{
                                background: transition.toStatus?.color
                            }}
                        >
                            <ClockArrowUp /> {transition.toStatus?.name}
                        </Badge>
                    </div>
                    <p>
                        <span className="font-semibold">Mô tả hướng chuyển đổi: </span>
                        <span className="text-muted-foreground">{transition.label}</span>
                    </p>
                    <p>
                        <span className="font-semibold">Yêu cầu kiểm tra: </span>
                        <span className="text-muted-foreground">
                            {transition.isScanningRequired ? 'Quét mã vạch barcode' : 'Không có yêu cầu'}
                        </span>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default TransitionGrid
