import {
    Album,
    ArrowDown10,
    ChartLine,
    CircleDollarSignIcon,
    ClipboardType,
    ClockArrowUp,
    Cog,
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
                url: '/cap-nhat-thong-tin'
            },
            {
                title: 'Đổi mật khẩu',
                icon: LockKeyhole,
                url: '/doi-mat-khau'
            }
        ]
    },
    {
        title: 'Chăm sóc khách hàng',
        items: [
            {
                title: 'Danh sách khách hàng',
                icon: Users,
                url: '/khach-hang',
                accessRequirement: permissions.accessCustomerDashboardPage
            },
            {
                title: 'Trò chuyện trực tuyến',
                icon: MessageCircleMore,
                url: '/khach-hang/tro-chuyen',
                accessRequirement: permissions.accessAdvisoryDashboardPage
            }
        ]
    },
    {
        title: 'Đơn hàng và vận chuyển',
        items: [
            {
                title: 'Quản lý đơn hàng',
                icon: ShoppingCart,
                url: '/don-hang',
                accessRequirement: permissions.accessOrderDashboardPage
            },
            {
                title: 'Trạng thái đơn hàng',
                icon: ClockArrowUp,
                url: '/trang-thai-don-hang'
            },
            {
                title: 'Chuyển đổi trạng thái',
                icon: Cog,
                url: '/trang-thai-don-hang/chuyen-trang-thai',
                accessRequirement: permissions.accessTransitionDashboardPage
            }
        ]
    },
    {
        title: 'Sản phẩm và thuơng hiệu',
        items: [
            {
                title: 'Danh sách thương hiệu',
                icon: Crown,
                url: '/thuong-hieu'
            },
            {
                title: 'Danh mục giày dép',
                icon: Album,
                url: '/danh-muc'
            },
            {
                title: 'Danh sách sản phẩm',
                icon: Footprints,
                url: '/san-pham'
            }
        ]
    },
    {
        title: 'Khuyến mãi',
        items: [
            {
                title: 'Chương trình khuyến mãi',
                icon: ArrowDown10,
                url: '/khuyen-mai'
            },
            {
                title: 'Phiếu giảm giá',
                icon: TicketCheck,
                url: '/khuyen-mai/phieu-giam-gia',
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
                url: '/nhan-su/nhan-vien',
                accessRequirement: permissions.accessStaffDashboardPage
            },
            {
                title: 'Vai trò và quyền hạn',
                icon: KeyRound,
                url: '/nhan-su/vai-tro',
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
                url: '/don-nhap-hang',
                accessRequirement: permissions.accessImportDashboardPage
            },
            {
                title: 'Báo cáo thiệt hại',
                icon: ClipboardType,
                url: '/bao-cao-thiet-hai',
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
                url: '/thong-ke/san-pham',
                accessRequirement: permissions.accessProductStatisticPage
            },
            {
                title: 'Thống kê doanh thu',
                icon: ChartLine,
                url: '/thong-ke/doanh-thu',
                accessRequirement: permissions.accessRevenueStatisticPage
            }
        ]
    }
]
