import {
    Album,
    ArrowDown10,
    ChartLine,
    CircleDollarSignIcon,
    ClipboardType,
    Crown,
    Footprints,
    KeyRound,
    LockKeyhole,
    LucideIcon,
    MessageCircleMore,
    Package,
    ShieldUser,
    ShoppingCart,
    TicketCheck,
    UserIcon,
    Users
} from 'lucide-react'
import permissions from '@/configs/permissions'

export type SidebarGroupData = {
    title: string
    items: {
        title: string
        icon: LucideIcon
        url?: string
        accessRequirement?: (typeof permissions)[keyof typeof permissions]
        isActive?: boolean
        children?: {
            title: string
            url: string
            accessRequirement?: (typeof permissions)[keyof typeof permissions]
        }[]
    }[]
}

export const sidebarGroups: SidebarGroupData[] = [
    {
        title: 'Profile',
        items: [
            {
                title: 'Thông tin cá nhân',
                icon: UserIcon,
                url: '/profile'
            },
            {
                title: 'Đổi mật khẩu',
                icon: LockKeyhole,
                url: '/change-password'
            }
        ]
    },
    {
        title: 'Chăm sóc khách hàng',
        items: [
            {
                title: 'Danh sách khách hàng',
                icon: Users,
                url: '/customers',
                accessRequirement: permissions.accessCustomerDashboardPage
            },
            {
                title: 'Trò chuyện trực tuyến',
                icon: MessageCircleMore,
                url: '/chat',
                accessRequirement: permissions.accessAdvisoryDashboardPage
            }
        ]
    },
    {
        title: 'Đơn hàng và vận chuyển',
        items: [
            {
                title: 'Đơn hàng',
                icon: ShoppingCart,
                url: '/orders',
                accessRequirement: permissions.accessOrderDashboardPage
            }
        ]
    },
    {
        title: 'Sản phẩm và thuơng hiệu',
        items: [
            {
                title: 'Thương hiệu',
                icon: Crown,
                url: '/brands'
            },
            {
                title: 'Danh mục hàng hóa',
                icon: Album,
                url: '/categories'
            },
            {
                title: 'Danh sách sản phẩm',
                icon: Footprints,
                url: '/products'
            }
        ]
    },
    {
        title: 'Khuyến mãi',
        items: [
            {
                title: 'Chương trình khuyến mãi',
                icon: ArrowDown10,
                url: '/promotions'
            },
            {
                title: 'Phiếu giảm giá',
                icon: TicketCheck,
                url: '/promotions/coupons',
                accessRequirement: permissions.accessCouponDashboardPage
            }
        ]
    },
    {
        title: 'Nhân sự',
        items: [
            {
                title: 'Quản lý nhân viên',
                icon: ShieldUser,
                url: '/personnel/staffs',
                accessRequirement: permissions.accessStaffDashboardPage
            },
            {
                title: 'Vai trò và quyền hạn',
                icon: KeyRound,
                url: '/personnel/staff-roles',
                accessRequirement: permissions.accessRoleDashboardPage
            }
        ]
    },
    {
        title: 'Kho hàng',
        items: [
            {
                title: 'Đơn nhập hàng',
                icon: Package,
                url: '/product-imports',
                accessRequirement: permissions.accessImportDashboardPage
            },
            {
                title: 'Báo cáo thiệt hại',
                icon: ClipboardType,
                url: '/damage-reports',
                accessRequirement: permissions.accessDamageReportDashboardPage
            }
        ]
    },
    {
        title: 'Thống kê',
        items: [
            {
                title: 'Thống kê sản phẩm',
                icon: CircleDollarSignIcon,
                url: '/statistics/product',
                accessRequirement: permissions.accessProductStatisticPage
            },
            {
                title: 'Thống kê doanh thu',
                icon: ChartLine,
                url: '/statistics/revenue',
                accessRequirement: permissions.accessRevenueStatisticPage
            }
        ]
    }
]
