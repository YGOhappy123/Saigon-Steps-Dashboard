declare global {
    interface IProductImport {
        importId: number
        invoiceNumber: string
        totalCost: number
        importDate: string
        trackedAt: string
        trackedBy: number

        trackedByStaff?: Partial<IStaff>
        importItems: {
            productItemId: number
            cost: number
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
    }

    interface IInventoryDamageReport {
        reportId: number
        totalExpectedCost: number
        reason: InventoryDamageReason
        note?: string
        reportedAt: string
        reportedBy: number

        reportedByStaff?: Partial<IStaff>
        reportItems: {
            productItemId: number
            expectedCost: number
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
    }

    interface IInventoryUpdateLog {
        logId: number
        productItemId: number
        type: InventoryUpdateType
        orderId?: number
        importId?: number
        damageReportId?: number
        quantity: number
        updatedAt: string

        order?: Partial<IOrder>
        import?: Partial<IProductImport>
        damageReport?: Partial<IInventoryDamageReport>
        productItem?: {
            productItemId: number
            size: string
            rootProduct: {
                name: string
                slug: string
                images: Partial<IProductImage>[] | string[]
            }
        }
    }

    type InventoryDamageReason = 'LOST' | 'BROKEN' | 'DEFECTIVE' | 'OTHER'
    type InventoryUpdateType = 'RESERVE' | 'RELEASE' | 'STOCK_IN' | 'STOCK_OUT' | 'RETURN' | 'DAMAGE'
}

export {}
