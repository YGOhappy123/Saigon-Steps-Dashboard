import { UseMutationResult } from '@tanstack/react-query'
import { TicketCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AVAILABLE_TRANSITIONS, ORDER_STATUS_MAP } from '@/configs/constants'
import OrderCardItemTable from '@/features/order/components/OrderCardItemTable'
import OrderCardUpdateLogTable from '@/features/order/components/OrderCardUpdateLogTable'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'

type OrderCardProps = {
    order: IOrder
    hasPermission: boolean
    updateStatusMutation: UseMutationResult<any, any, { orderId: number; data: { status: OrderStatus } }, any>
}

const OrderCard = ({ order, hasPermission, updateStatusMutation }: OrderCardProps) => {
    const isDelivery = order.deliveryAddress != null
    const buttons: {
        label: string
        status: OrderStatus
        variant: 'default' | 'destructive' | 'success'
        disabled?: boolean
    }[] = [
        { label: 'Chấp nhận đơn hàng', status: 'ACCEPTED', variant: 'default' },
        { label: 'Đóng gói đơn hàng', status: 'PACKED', variant: 'default' },
        { label: 'Bàn giao cho đơn vị vận chuyển', status: 'DISPATCHED', variant: 'default' },
        { label: 'Giao hàng thành công', status: 'DELIVERY_SUCCESS', variant: 'success' },
        { label: 'Giao hàng thất bại', status: 'DELIVERY_FAILED', variant: 'destructive' },
        {
            label: 'Nhận lại từ đơn vị vận chuyển',
            status: 'RETURNED',
            variant: 'destructive',
            disabled: !!order.deliveredAt
        },
        { label: 'Xác nhận đổi trả', status: 'RETURNED', variant: 'destructive', disabled: !order.deliveredAt },
        { label: 'Từ chối đơn hàng', status: 'CANCELLED', variant: 'destructive' }
    ]

    const handleProcessOrder = async (newStatus: OrderStatus) => {
        await updateStatusMutation.mutateAsync({
            orderId: order.orderId,
            data: { status: newStatus }
        })
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Thông tin đơn hàng mã: {order.orderId}</CardTitle>
                <CardDescription>Đặt lúc {dayjs(order.createdAt).format('HH:mm:ss ngày DD/MM/YYYY')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-primary-foreground border-primary mx-auto mb-2 flex w-fit items-center justify-center gap-6 rounded-full border-4 px-6">
                    <span className="text-primary py-2 text-xl font-semibold">{ORDER_STATUS_MAP[order.status]}</span>
                    <div className="border-primary h-12 border-l-4"></div>
                    <span className="text-primary py-2 text-xl font-semibold">{formatCurrency(order.totalAmount)}</span>
                </div>

                <Accordion type="multiple" className="w-full" defaultValue={['item-1', 'item-2']}>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                            <div className="flex flex-col">
                                <h4 className="text-lg font-semibold">1. Thông tin khách hàng</h4>
                                <span className="text-muted-foreground text-sm">
                                    Thông tin về tài khoản khách hàng đã tạo đơn.
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex gap-12 p-4">
                                <div className="border-primary flex w-full max-w-[100px] items-center justify-center rounded-full border-4 p-1">
                                    <img
                                        src={order.customer.avatar || '/images/upload-icon.jpg'}
                                        className="bg-primary-foreground aspect-square h-full w-full rounded-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col gap-4 text-base">
                                    <div className="text-card-foreground">
                                        <span className="font-medium">1.1. Họ và tên: </span>
                                        {order.customer.name}
                                    </div>
                                    <div className="text-card-foreground">
                                        <span className="font-medium">1.2. Email: </span>
                                        {order.customer.email ?? '(Chưa cập nhật)'}
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                            <div className="flex flex-col">
                                <h4 className="text-lg font-semibold">2. Thông tin đơn hàng</h4>
                                <span className="text-muted-foreground text-sm">
                                    Số lượng và chi tiết phân loại các sản phẩm trong đơn hàng.
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4">
                            <OrderCardItemTable orderItems={order.orderItems} />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                            <div className="flex flex-col">
                                <h4 className="text-lg font-semibold">3. Thông tin nhận hàng</h4>
                                <span className="text-muted-foreground text-sm">
                                    Phương thức nhận hàng và thông tin vận chuyển (nếu có).
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-1 flex-col gap-4 p-4 text-base">
                            <div className="text-card-foreground flex justify-between gap-6">
                                <span className="font-medium">3.1. Phương thức nhận hàng: </span>
                                <span>
                                    {isDelivery ? 'Vận chuyển qua đường bưu điện.' : 'Nhận trực tiếp tại cửa hàng.'}
                                </span>
                            </div>

                            {isDelivery && (
                                <>
                                    <div className="text-card-foreground flex justify-between gap-10">
                                        <span className="shrink-0 font-medium">3.2. Họ và tên người nhận: {}</span>
                                        <span className="text-end">{order.recipientName}</span>
                                    </div>
                                    <div className="text-card-foreground flex justify-between gap-10">
                                        <span className="font-medium">3.3. Số điện thoại người nhận: {}</span>
                                        <span className="text-end">{order.deliveryPhone}</span>
                                    </div>
                                    <div className="text-card-foreground flex justify-between gap-10">
                                        <span className="shrink-0 font-medium">3.4. Địa chỉ nhận hàng: {}</span>
                                        <span className="text-end">{order.deliveryAddress}</span>
                                    </div>
                                </>
                            )}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                            <div className="flex flex-col">
                                <h4 className="text-lg font-semibold">4. Thông tin khác</h4>
                                <span className="text-muted-foreground text-sm">
                                    Thông tin về ghi chú và mã giảm giá (nếu có).
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-1 flex-col gap-4 p-4 text-base">
                            <div className="text-card-foreground flex justify-between gap-10">
                                <span className="shrink-0 font-medium">4.1. Ghi chú đơn hàng: {}</span>
                                <span className="text-end">{order.note ?? '(Không có)'}</span>
                            </div>
                            <div className="text-card-foreground flex justify-between gap-10">
                                <span className="shrink-0 font-medium">4.2. Thời gian giao hàng: {}</span>
                                <span className="text-end">
                                    {order.deliveredAt
                                        ? dayjs(order.deliveredAt).format('HH:mm:ss ngày DD/MM/YYYY')
                                        : '(Chưa giao hàng)'}
                                </span>
                            </div>
                            <div className="text-card-foreground flex justify-between gap-10">
                                <span className="shrink-0 font-medium">4.3. Thời gian đổi trả: {}</span>
                                <span className="text-end">
                                    {order.refundedAt
                                        ? dayjs(order.refundedAt).format('HH:mm:ss ngày DD/MM/YYYY')
                                        : '(Không có)'}
                                </span>
                            </div>
                            {order.coupon != null ? (
                                <>
                                    <div className="text-card-foreground flex justify-between gap-10">
                                        <span className="shrink-0 font-medium">4.4. Mã giảm giá: {}</span>
                                        <Badge variant="default">
                                            <TicketCheck /> {order.coupon.code.toUpperCase()} -{' '}
                                            {order.coupon.type === 'FIXED'
                                                ? formatCurrency(order.coupon.amount)
                                                : `${order.coupon.amount}%`}
                                        </Badge>
                                    </div>
                                </>
                            ) : (
                                <div className="text-card-foreground flex justify-between gap-10">
                                    <span className="shrink-0 font-medium">4.2. Mã giảm giá: {}</span>
                                    <span className="text-end">(Không có)</span>
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                            <div className="flex flex-col">
                                <h4 className="text-lg font-semibold">5. Thông tin trạng thái</h4>
                                <span className="text-muted-foreground text-sm">
                                    Thông tin về lịch sử cập nhật trạng thái của đơn hàng.
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="py-4">
                            <OrderCardUpdateLogTable statusUpdateLogs={order.statusUpdateLogs} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {hasPermission && (
                    <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-2">
                        {buttons.map((btn, index) => (
                            <ConfirmationDialog
                                key={index}
                                title="Bạn có chắc muốn cập nhật trạng thái này?"
                                description="Không thể hoàn tác hành động này."
                                onConfirm={() => handleProcessOrder(btn.status)}
                                trigger={
                                    <Button
                                        key={btn.status}
                                        disabled={
                                            !AVAILABLE_TRANSITIONS[order.status]?.includes(btn.status) || btn.disabled
                                        }
                                        variant={btn.variant}
                                    >
                                        {btn.label}
                                    </Button>
                                }
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default OrderCard
