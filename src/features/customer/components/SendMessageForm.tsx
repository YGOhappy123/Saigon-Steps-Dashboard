import { useSelector } from 'react-redux'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { SendIcon, Trash2 } from 'lucide-react'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import { onError } from '@/utils/errorsHandler'
import { RootState } from '@/store'
import ChatImageUploader from '@/features/customer/components/ChatImageUploader'
import useAxiosIns from '@/hooks/useAxiosIns'
import fileService from '@/services/fileService'

const sendMessageFormSchema = z
    .object({
        textContent: z.string().max(1000, 'Nội dung tin nhắn không được vượt quá 1000 ký tự.').optional(),
        imageContent: z.string().optional()
    })
    .refine(data => data.textContent || data.imageContent, {
        message: 'Vui lòng nhập nội dung tin nhắn hoặc chọn ảnh để gửi.'
    })

type SendMessageFormProps = {
    conversationId: number
    onOptimisticDisplay: (message: IChatMessage) => void
}

const SendMessageForm = ({ conversationId, onOptimisticDisplay }: SendMessageFormProps) => {
    const form = useForm<z.infer<typeof sendMessageFormSchema>>({
        resolver: zodResolver(sendMessageFormSchema),
        defaultValues: {
            textContent: '',
            imageContent: ''
        }
    })

    const { uploadBase64Mutation } = fileService()
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)!
    const sendMessageMutation = useMutation({
        mutationFn: ({
            conversationId,
            data
        }: {
            conversationId: number
            data: Partial<IChatMessage> & { tempId: number }
        }) => axios.post<IResponseData<any>>(`/chats/${conversationId}`, data),
        onError: onError
    })

    const onSubmit = async (values: z.infer<typeof sendMessageFormSchema>) => {
        // Show temp message immediately
        const tempId = new Date().getTime()
        const tempMessage: IChatMessage = {
            messageId: tempId,
            conversationId: conversationId,
            textContent: values.textContent,
            imageContent: values.imageContent,
            sentAt: new Date().toISOString(),
            senderStaffId: user.staffId,
            senderStaff: user
        }

        onOptimisticDisplay(tempMessage)
        form.reset()

        // Send message to server afterwards
        const data: Partial<IChatMessage> & { tempId: number } = { tempId: tempId }

        if (values.textContent) {
            data.textContent = values.textContent
        }
        if (values.imageContent) {
            const res = await uploadBase64Mutation.mutateAsync({ base64: values.imageContent, folder: 'message' })
            const newImageUrl = res.data.data?.imageUrl
            if (newImageUrl) data.imageContent = newImageUrl
        }

        await sendMessageMutation.mutateAsync({
            conversationId: conversationId,
            data: data
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
                {form.watch('imageContent') && (
                    <div className="relative mb-4 w-fit">
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

                    <ChatImageUploader setImage={image => form.setValue('imageContent', image)} />

                    <Button
                        type="submit"
                        className="size-12"
                        disabled={!form.watch('textContent') && !form.watch('imageContent')}
                    >
                        <SendIcon size={64} />
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default SendMessageForm
