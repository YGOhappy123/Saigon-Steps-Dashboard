declare global {
    interface IOrder {
        orderId: number
        customerId: number
        orderStatusId: number
        couponId: number
        totalAmount: number
        status: OrderStatus
        recipientName?: string
        deliveryAddress?: string
        deliveryPhone?: string
        note?: string
        createdAt: string
        deliveredAt?: string
        refundedAt?: string

        customer: Partial<ICustomer>
        coupon?: ICoupon
        orderItems: {
            productItemId: number
            price: number
            quantity: number

            productItem?: {
                productItemId: number
                size: string
                rootProduct: {
                    name: string
                    slug: string
                    images: Partial<IProductImage>[] | string[]
                }
            }
        }[]
        statusUpdateLogs: IOrderStatusUpdateLog[]
    }

    interface IOrderStatusUpdateLog {
        logId: number
        orderId: number
        status: OrderStatus
        updatedAt: string
        updatedBy: number

        updatedByStaff?: Partial<IStaff>
    }

    type OrderStatus =
        | 'PENDING'
        | 'ACCEPTED'
        | 'PACKED'
        | 'DISPATCHED'
        | 'DELIVERY_SUCCESS'
        | 'DELIVERY_FAILED'
        | 'CANCELLED'
        | 'RETURNED'
}

export {}
