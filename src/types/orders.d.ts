declare global {
    interface IOrder {
        orderId: number
        customerId: number
        orderStatusId: number
        couponId: number
        totalAmount: number
        statusId: number
        recipientName?: string
        deliveryAddress?: string
        deliveryPhone?: string
        note?: string
        createdAt: string
        deliveredAt?: string
        refundedAt?: string

        customer: Partial<ICustomer>
        status: Partial<IOrderStatus>
        coupon?: ICoupon
        orderItems: {
            productItemId: number
            price: number
            quantity: number

            productItem?: {
                productItemId: number
                size: string
                barcode: string
                rootProduct: {
                    name: string
                    slug: string
                    images: Partial<IProductImage>[] | string[]
                }
            }
        }[]
        statusUpdateLogs: IOrderStatusUpdateLog[]
        availableTransitions: IOrderStatusTransition[]
    }

    interface IOrderStatusUpdateLog {
        logId: number
        orderId: number
        statusId: number
        updatedAt: string
        updatedBy: number

        updatedByStaff?: Partial<IStaff>
        status: Partial<IOrderStatus>
    }

    interface IOrderStatus {
        statusId: number
        name: string
        description: string
        color: string
        isDefault: boolean
        shouldReserveStock: boolean
        shouldReleaseStock: boolean
        shouldReduceStock: boolean
        shouldIncreaseStock: boolean
        shouldMarkAsDelivered: boolean
        shouldMarkAsRefunded: boolean
        shouldSendNotification: boolean
    }

    interface IOrderStatusTransition {
        fromStatusId: number
        toStatusId: number
        label: string
        isScanningRequired: boolean

        fromStatus?: Partial<IOrderStatus>
        toStatus?: Partial<IOrderStatus>
    }
}

export {}
