import { TicketCheck } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
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
import { Badge } from '@/components/ui/badge'
import OrderCardItemTable from '@/features/order/components/OrderCardItemTable'
import OrderCardUpdateLogTable from '@/features/order/components/OrderCardUpdateLogTable'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type ViewOrderDialogProps = {
    order: IOrder | null
    open: boolean
    setOpen: (value: boolean) => void
}

const ViewOrderDialog = ({ order, open, setOpen }: ViewOrderDialogProps) => {
    const isDelivery = order?.deliveryAddress != null

    if (!order) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thông tin đơn hàng</DialogTitle>
                    <DialogDescription>
                        Thông tin chi tiết về khách hàng, sản phẩm, lịch sử cập nhật,... của đơn hàng.
                    </DialogDescription>
                </DialogHeader>
                <Separator />

                <div
                    className="bg-primary-foreground mx-auto flex w-fit items-center justify-center gap-6 rounded-full border-4 px-6"
                    style={{
                        borderColor: order.status.color,
                        color: order.status.color
                    }}
                >
                    <span className="py-2 text-xl font-semibold">{order.status.name}</span>
                    <div
                        className="h-12 border-l-4"
                        style={{
                            borderColor: order.status.color
                        }}
                    ></div>
                    <span className="py-2 text-xl font-semibold">{formatCurrency(order.totalAmount)}</span>
                </div>

                <Accordion
                    type="multiple"
                    className="max-h-[420px] w-full overflow-y-auto"
                    defaultValue={['item-1', 'item-2']}
                >
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
                                <span className="text-end">{order.note || '(Không có)'}</span>
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

export default ViewOrderDialog
