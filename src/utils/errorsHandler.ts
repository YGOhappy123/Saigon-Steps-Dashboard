import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { DEFAULT_RESPONSE_ERROR_MESSAGE } from '@/configs/constants'
import toastConfig from '@/configs/toast'

export const onError = (error: Error) => {
    const errorMessage =
        ((error as AxiosError<IResponseData<unknown>>).response?.data?.message as string) ||
        DEFAULT_RESPONSE_ERROR_MESSAGE
    toast(getMappedMessage(errorMessage), toastConfig('error'))
}
