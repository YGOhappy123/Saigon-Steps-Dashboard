declare global {
    interface ICustomer {
        customerId: number
        name: string
        createdAt: string
        email?: string
        avatar?: string
        isActive?: boolean
    }

    interface IStaff {
        staffId: number
        name: string
        createdAt: string
        email?: string
        avatar?: string
        isActive?: boolean

        roleId: number
        role: Partial<IStaffRole> | string
        permissions: string[]
        createdBy?: number
        createdByStaff?: Partial<IStaff> | string
    }

    interface IStaffRole {
        roleId: number
        name: string
        isImmutable: boolean
        permissions?: (string | number | IPermission)[]
    }

    interface IPermission {
        permissionId: number
        name: string
        code: string
    }
}

export {}
