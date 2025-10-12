import { SiFacebook, SiYoutube, SiTiktok, SiInstagram, SiX, IconType } from '@icons-pack/react-simple-icons'

export const SOCIAL_LINKS: {
    platform: string
    url: string
    Icon: IconType
}[] = [
    { platform: 'facebook', url: 'https://www.facebook.com', Icon: SiFacebook },
    { platform: 'youtube', url: 'https://youtube.com', Icon: SiYoutube },
    { platform: 'tiktok', url: 'https://www.tiktok.com', Icon: SiTiktok },
    { platform: 'instagram', url: 'https://www.instagram.com', Icon: SiInstagram },
    { platform: 'x', url: 'https://x.com', Icon: SiX }
]

export const LOGIN_SESSION_EXPIRED_MESSAGE = 'Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại.'

export const DEFAULT_RESPONSE_ERROR_MESSAGE = 'Xảy ra lỗi không xác định. Vui lòng thử lại sau.'

export const INTRODUCTION_VIDEO_URL = 'https://youtube.com'

export const AUTH_CAROUSEL_IMAGES = ['https://i.pinimg.com/originals/18/e9/a9/18e9a95be92d5f3d01dd8d2b78744cf3.gif']

export const SHOE_GENDER_MAP: { [key in ShoeGender]: string } = {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    UNISEX: 'Unisex'
}

export const SHOE_GENDER_OPTIONS = Object.entries(SHOE_GENDER_MAP).map(([value, label]) => ({ value, label }))

export const COUPON_TYPE_MAP: { [key in CouponType]: string } = {
    PERCENTAGE: 'Giảm theo phần trăm',
    FIXED: 'Giảm theo số tiền cố định'
}

export const COUPON_TYPE_OPTIONS = Object.entries(COUPON_TYPE_MAP).map(([value, label]) => ({ value, label }))

export const INVENTORY_DAMAGE_REASON_MAP: { [key in InventoryDamageReason]: string } = {
    LOST: 'Bị thất lạc',
    BROKEN: 'Hư hỏng tại cửa hàng',
    DEFECTIVE: 'Lỗi từ nhà sản xuất',
    OTHER: 'Nguyên nhân khác'
}

export const INVENTORY_DAMAGE_REASON_OPTIONS = Object.entries(INVENTORY_DAMAGE_REASON_MAP).map(([value, label]) => ({
    value,
    label
}))

export const ORDER_STATUS_MAP: { [key in OrderStatus]: string } = {
    PENDING: 'Chờ xử lý',
    ACCEPTED: 'Đã xác nhận',
    PACKED: 'Đã đóng gói',
    DISPATCHED: 'Đang giao hàng',
    DELIVERY_SUCCESS: 'Giao hàng thành công',
    DELIVERY_FAILED: 'Giao hàng thất bại',
    CANCELLED: 'Bị từ chối',
    RETURNED: 'Đã hoàn trả'
}

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_MAP).map(([value, label]) => ({ value, label }))

export const AVAILABLE_TRANSITIONS: { [key in OrderStatus]: OrderStatus[] } = {
    PENDING: ['ACCEPTED', 'CANCELLED'],
    ACCEPTED: ['PACKED'],
    PACKED: ['DISPATCHED'],
    DISPATCHED: ['DELIVERY_SUCCESS', 'DELIVERY_FAILED'],
    DELIVERY_SUCCESS: ['RETURNED'],
    DELIVERY_FAILED: ['RETURNED'],
    CANCELLED: [],
    RETURNED: []
}
