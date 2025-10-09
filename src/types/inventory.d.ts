declare global {
    interface IProductImport {
        importId: number
        invoiceNumber: string
        totalCost: number
        importDate: string
        trackedAt: string
        trackedBy: number

        trackedByStaff?: Partial<IStaff> | string
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

        reportedByStaff?: Partial<IStaff> | string
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

    type InventoryDamageReason = 'LOST' | 'BROKEN' | 'DEFECTIVE' | 'OTHER'
}

export {}
