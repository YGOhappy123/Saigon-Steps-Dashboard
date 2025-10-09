export const SORT_MAPPING = {
    '-customerId': { customerId: 'desc' },
    '+customerId': { customerId: 'asc' },
    '-staffId': { staffId: 'desc' },
    '+staffId': { staffId: 'asc' },
    '-roleId': { roleId: 'desc' },
    '+roleId': { roleId: 'asc' },
    '-categoryId': { categoryId: 'desc' },
    '+categoryId': { categoryId: 'asc' },
    '-brandId': { brandId: 'desc' },
    '+brandId': { brandId: 'asc' },
    '-productId': { rootProductId: 'desc' },
    '+productId': { rootProductId: 'asc' },
    '-orderId': { orderId: 'desc' },
    '+orderId': { orderId: 'asc' },
    '-promotionId': { promotionId: 'desc' },
    '+promotionId': { promotionId: 'asc' },
    '-couponId': { couponId: 'desc' },
    '+couponId': { couponId: 'asc' },
    '-importId': { importId: 'desc' },
    '+importId': { importId: 'asc' },
    '-reportId': { reportId: 'desc' },
    '+reportId': { reportId: 'asc' },

    '-createdAt': { createdAt: 'desc' },
    '+createdAt': { createdAt: 'asc' },
    '-amount': { totalAmount: 'desc' },
    '+amount': { totalAmount: 'asc' },
    '-price': { price: 'desc' },
    '+price': { price: 'asc' },
    '-discountRate': { discountRate: 'desc' },
    '+discountRate': { discountRate: 'asc' },
    '-cost': { totalCost: 'desc' },
    '+cost': { totalCost: 'asc' },
    '-expectedCost': { totalExpectedCost: 'desc' },
    '+expectedCost': { totalExpectedCost: 'asc' }
}

export const getMappedSort = (sort: string) => {
    return SORT_MAPPING[sort as keyof typeof SORT_MAPPING] ?? []
}
