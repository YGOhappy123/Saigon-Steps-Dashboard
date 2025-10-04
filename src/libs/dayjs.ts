import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/vi'
import 'dayjs/locale/en'

dayjs.extend(relativeTime)
dayjs.extend(tz)
dayjs.extend(utc)
dayjs.extend(weekday)
dayjs.extend(localizedFormat)

dayjs.tz.setDefault('Asia/Ho_Chi_Minh')
dayjs.locale('vi')

export const setLocale = (locale: 'vi' | 'en' | null) => {
    dayjs.locale(locale ?? 'vi')
}

export default dayjs
