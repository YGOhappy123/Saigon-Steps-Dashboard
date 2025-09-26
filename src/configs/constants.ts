import { SiFacebook, SiYoutube, SiTiktok, SiInstagram, SiX, IconType } from '@icons-pack/react-simple-icons'

type SocialLink = {
    platform: string
    url: string
    Icon: IconType
}

export const SOCIAL_LINKS: SocialLink[] = [
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

export const BADGE_COLORS = ['#9b5de5', '#f15bb5', '#f18701', '#00bbf9', '#00f5d4']
