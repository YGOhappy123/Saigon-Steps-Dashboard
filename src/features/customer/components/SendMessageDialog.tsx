import { ClipboardEvent, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Smile, Trash2 } from 'lucide-react'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useMutation } from '@tanstack/react-query'
import { onError } from '@/utils/errorsHandler'
import { useThemeContext } from '@/components/container/ThemeProvider'
import { EmojiPicker } from '@/components/common/EmojiPicker'
import { getMappedMessage } from '@/utils/resMessageMapping'
import ChatImageUploader from '@/features/customer/components/ChatImageUploader'
import useAxiosIns from '@/hooks/useAxiosIns'
import fileService from '@/services/fileService'
import toastConfig from '@/configs/toast'

const chatMessageFormSchema = z
    .object({
        textContent: z.string().max(1000, 'Nội dung tin nhắn không được vượt quá 1000 ký tự.').optional(),
        imageContent: z.string().optional()
    })
    .refine(data => data.textContent || data.imageContent, {
        message: 'Vui lòng nhập nội dung tin nhắn hoặc chọn ảnh để gửi.'
    })

type SendMessageDialogProps = {
    customer: ICustomer | null
    open: boolean
    setOpen: (value: boolean) => void
}

const SendMessageDialog = ({ customer, open, setOpen }: SendMessageDialogProps) => {
    const form = useForm<z.infer<typeof chatMessageFormSchema>>({
        resolver: zodResolver(chatMessageFormSchema),
        defaultValues: {
            textContent: '',
            imageContent: ''
        }
    })

    const { uploadBase64Mutation } = fileService()
    const { theme } = useThemeContext()
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
    const axios = useAxiosIns()
    const sendMessageMutation = useMutation({
        mutationFn: ({ customerId, data }: { customerId: number; data: Partial<IChatMessage> & { tempId: number } }) =>
            axios.post<IResponseData<any>>(`/chats/${customerId}`, data),
        onError: onError,
        onSuccess: res => {
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const onSubmit = async (values: z.infer<typeof chatMessageFormSchema>) => {
        if (!customer) return

        const data: Partial<IChatMessage> & { tempId: number } = { tempId: new Date().getTime() }

        if (values.textContent) {
            data.textContent = values.textContent
        }
        if (values.imageContent) {
            const res = await uploadBase64Mutation.mutateAsync({ base64: values.imageContent, folder: 'message' })
            const newImageUrl = res.data.data?.imageUrl
            if (newImageUrl) data.imageContent = newImageUrl
        }

        await sendMessageMutation.mutateAsync({
            customerId: customer.customerId,
            data: data
        })

        form.reset()
        setOpen(false)
    }

    const handlePaste = (e: ClipboardEvent<HTMLFormElement>) => {
        const items = e.clipboardData?.items
        if (!items) return

        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile()
                if (!file) continue

                const reader = new FileReader()
                reader.onloadend = () => form.setValue('imageContent', reader.result as any)
                reader.readAsDataURL(file)
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="md:min-w-2xl">
                <DialogHeader>
                    <DialogTitle>Liên hệ với khách hàng: {customer?.name}</DialogTitle>
                    <DialogDescription>
                        Thêm nội dung văn bản hoặc hình ảnh. Ấn "Xác nhận" sau khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} onPaste={handlePaste} className="flex flex-col gap-4">
                        {form.watch('imageContent') && (
                            <div className="relative w-fit">
                                <img
                                    src={form.watch('imageContent')}
                                    alt="Chat image content"
                                    className="max-h-[100px] max-w-[300px] rounded-lg object-contain"
                                />
                                <Button
                                    className="absolute right-2 bottom-2"
                                    variant="destructive"
                                    type="button"
                                    size="icon"
                                    onClick={() => {
                                        form.setValue('imageContent', '')
                                    }}
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <FormField
                                control={form.control}
                                name="textContent"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                autoFocus
                                                autoComplete="off"
                                                placeholder="Nội dung tin nhắn..."
                                                className="caret-card-foreground text-card-foreground h-12 border-2 font-semibold"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="relative">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="size-12"
                                    onClick={() => setIsEmojiPickerOpen(prev => !prev)}
                                >
                                    <Smile />
                                </Button>
                                {isEmojiPickerOpen && (
                                    <EmojiPicker
                                        theme={theme}
                                        onSelect={emoji => {
                                            const currentText = form.getValues('textContent') || ''
                                            form.setValue('textContent', `${currentText} ${emoji}`.trim())
                                            setIsEmojiPickerOpen(false)
                                        }}
                                    />
                                )}
                            </div>
                            <ChatImageUploader setImage={image => form.setValue('imageContent', image)} />
                        </div>
                        <Separator />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Đặt lại
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset()
                                    setOpen(false)
                                }}
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    (!form.watch('textContent') && !form.watch('imageContent')) ||
                                    sendMessageMutation.isPending
                                }
                            >
                                Xác nhận
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default SendMessageDialog
