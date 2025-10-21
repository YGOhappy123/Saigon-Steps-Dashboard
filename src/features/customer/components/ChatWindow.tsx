import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MessageCircleIcon, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSocketContext } from '@/components/container/SocketProvider'
import ChatMessageForm from '@/features/customer/components/ChatMessageForm'
import ChatMessagesDisplay from '@/features/customer/components/ChatMessagesDisplay'
import useAxiosIns from '@/hooks/useAxiosIns'

type ChatWindowProps = {
    selectedConversationId: number | null
    setSelectedConversationId: (conversationId: number | null) => void
    hasChatPermission: boolean
}

const ChatWindow = ({ selectedConversationId, setSelectedConversationId, hasChatPermission }: ChatWindowProps) => {
    const axios = useAxiosIns()
    const messageEndRef = useRef<HTMLDivElement>(null)
    const { socket } = useSocketContext()
    const [conversation, setConversation] = useState<IConversation | null>(null)

    const getConversationQuery = useQuery({
        queryKey: ['conversation', selectedConversationId],
        queryFn: () => axios.get<IResponseData<IConversation>>(`/chats/${selectedConversationId}`),
        enabled: selectedConversationId != null,
        refetchOnWindowFocus: false,
        select: res => res.data
    })

    useEffect(() => {
        if (getConversationQuery.isSuccess && getConversationQuery.data) {
            setConversation(getConversationQuery.data?.data)
        }
    }, [getConversationQuery.isSuccess, getConversationQuery.data])

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelectedConversationId(null)
        }
        window.addEventListener('keydown', handleEscKey)

        return () => window.removeEventListener('keydown', handleEscKey)
    }, [setSelectedConversationId])

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [conversation?.messages])

    useEffect(() => {
        const handleNewMessage = ({ newMessage, tempId }: { newMessage: IChatMessage; tempId: number }) => {
            // Staff might join other conversations
            // Only care about messages that belong to the currently opened conversation
            if (newMessage.conversationId !== selectedConversationId) return

            setConversation(prev => {
                if (!prev || !prev.messages) return prev

                const optimisticMessageIndex = prev.messages.findIndex(msg => msg.messageId === tempId)
                if (optimisticMessageIndex !== -1) {
                    const messageList = [...prev.messages]
                    messageList[optimisticMessageIndex] = newMessage

                    return { ...prev, messages: messageList }
                }

                return { ...prev, messages: [...prev.messages, newMessage] }
            })
        }

        socket?.on('message:new', handleNewMessage)

        return () => {
            socket?.off('message:new', handleNewMessage)
        }
    }, [socket, selectedConversationId])

    if (!selectedConversationId) {
        return (
            <Card className="flex h-full flex-1 flex-col gap-0 py-0">
                <div className="flex flex-1 flex-col items-center justify-center gap-2 py-20">
                    <div className="flex size-20 items-center justify-center rounded-full bg-cyan-500/20">
                        <MessageCircleIcon className="size-10 text-cyan-400" />
                    </div>
                    <p className="mt-2 text-center font-semibold">Chọn cuộc trò chuyện</p>
                    <p className="text-muted-foreground text-center">
                        Hãy ấn vào một cuộc trò chuyện từ danh sách để bắt đầu trao đổi với khách hàng.
                    </p>
                </div>
            </Card>
        )
    }

    if (getConversationQuery.isPending) {
        return (
            <Card className="flex h-full flex-1 flex-col gap-0 py-0">
                <div className="flex h-full flex-col items-center justify-center gap-2">
                    <div role="status">
                        <svg
                            aria-hidden="true"
                            className="fill-primary inline h-12 w-12 animate-spin text-gray-200 dark:text-gray-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                    </div>
                    <p className="mt-2 font-semibold">Đang tải dữ liệu cuộc trò chuyện</p>
                    <p className="font-semibold">Xin vui lòng chờ đợi trong giây lát...</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="flex h-full flex-1 flex-col gap-0 overflow-hidden py-0">
            {conversation != null && (
                <>
                    <div className="flex items-center justify-between border-b p-4 lg:p-6">
                        <div className="flex items-center gap-4 lg:gap-6">
                            <Avatar className="size-12 rounded-full lg:size-16">
                                <AvatarImage src={conversation.customer?.avatar} alt={conversation.customer?.name} />
                            </Avatar>

                            <div>
                                <h3 className="text-lg font-medium">{conversation.customer?.name}</h3>
                                {conversation.customer?.email && (
                                    <p className="text-muted-foreground text-sm">{conversation.customer?.email}</p>
                                )}
                            </div>
                        </div>

                        <Button variant="ghost" size="icon" onClick={() => setSelectedConversationId(null)}>
                            <X />
                        </Button>
                    </div>

                    <CardContent className="h-full overflow-y-auto p-4 lg:p-6">
                        <ChatMessagesDisplay conversation={conversation} messageEndRef={messageEndRef} />
                    </CardContent>

                    {hasChatPermission && (
                        <div className="border-t">
                            {conversation.customer?.isActive ? (
                                <ChatMessageForm
                                    conversationId={conversation.conversationId}
                                    customerId={conversation.customer!.customerId!}
                                    onOptimisticDisplay={message => {
                                        setConversation(prev =>
                                            prev
                                                ? { ...prev, messages: [...(prev.messages as IChatMessage[]), message] }
                                                : prev
                                        )
                                    }}
                                />
                            ) : (
                                <div className="flex justify-center p-4 lg:p-6">
                                    <p className="text-muted-foreground max-w-[70%] text-center text-sm font-medium lg:max-w-[60%]">
                                        Tài khoản này hiện đã bị khóa hoặc không còn hoạt động.
                                        <br /> Bạn không thể gửi tin nhắn cho tài khoản này.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </Card>
    )
}

export default ChatWindow
