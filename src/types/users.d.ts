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
        roleId: number
        createdBy?: number

        isActive?: boolean
        permissions?: string[]
        role: Partial<IStaffRole>
        createdByStaff?: Partial<IStaff>
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
