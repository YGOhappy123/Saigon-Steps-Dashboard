declare global {
    interface IRootProduct {
        rootProductId: number
        brandId: number
        name: string
        slug: string
        description: string
        price: number
        isAccessory: boolean
        createdAt: string
        createdBy: number

        discountRate?: number
        brand?: Partial<IProductBrand>
        images?: Partial<IProductImage>[] | string[]
        createdByStaff?: Partial<IStaff>
        productItems?: Partial<IProductItem>[]
        promotions?: Partial<IPromotion>[]
        shoeFeature?: Partial<IShoeFeature>
    }

    interface IProductBrand {
        brandId: number
        name: string
        description: string
        logoUrl?: string
    }

    interface IProductImage {
        imageId: number
        rootProductId: number
        url: string
    }

    interface IProductItem {
        productItemId: number
        size: string
        stock: number
        barcode: string
        availableStock?: number
    }

    interface IShoeFeature {
        shoeFeatureId: number
        rootProductId: number
        categoryId: number
        gender: ShoeGender
        upperMaterial: string
        soleMaterial: string
        liningMaterial: string
        closureType: string
        toeShape: string
        waterResistant: string
        breathability: string
        pattern: string
        countryOfOrigin: string
        primaryColor: string
        secondaryColor?: string
        heelHeight: number
        durabilityRating: number
        releaseYear: number
        occasionTags?: string[]
        designTags?: string[]

        category?: Partial<IShoeCategory>
    }

    interface IShoeCategory {
        categoryId: number
        name: string
        createdAt: string
        createdBy: string

        createdByStaff?: Partial<IStaff>
    }

    interface IPromotion {
        promotionId: number
        name: string
        description: string
        discountRate: number
        startDate: string
        endDate: string
        isActive: boolean
        createdAt: string
        createdBy: number

        createdByStaff?: Partial<IStaff>
        products?: Partial<IRootProduct>[] | number[]
    }

    interface ICoupon {
        couponId: number
        code: string
        type: CouponType
        amount: number
        maxUsage?: number
        isActive: boolean
        expiredAt?: string
        createdAt: string
        createdBy: number

        createdByStaff?: Partial<IStaff>
    }

    type ShoeGender = 'MALE' | 'FEMALE' | 'UNISEX'
    type CouponType = 'PERCENTAGE' | 'FIXED'
}

export {}
