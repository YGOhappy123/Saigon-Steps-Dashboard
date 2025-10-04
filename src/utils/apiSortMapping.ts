export const SORT_MAPPING = {
    '-createdAt': { createdAt: 'desc' },
    '+createdAt': { createdAt: 'asc' },
    '-price': { price: 'desc' },
    '+price': { price: 'asc' },
    '-totalAmount': { totalAmount: 'desc' },
    '+totalAmount': { totalAmount: 'asc' },
    '-orderId': { orderId: 'desc' },
    '+orderId': { orderId: 'asc' },
    '-roleId': { roleId: 'desc' },
    '+roleId': { roleId: 'asc' },
    '-customerId': { customerId: 'desc' },
    '+customerId': { customerId: 'asc' },
    '-cost': { totalCost: 'desc' },
    '+cost': { totalCost: 'asc' }
}

export const getMappedSort = (sort: string) => {
    return SORT_MAPPING[sort as keyof typeof SORT_MAPPING] ?? []
}
