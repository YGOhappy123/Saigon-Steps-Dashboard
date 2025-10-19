import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { useIsMobile } from '@/hooks/useMobile'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import { SocketProvider, useSocketContext } from '@/components/container/SocketProvider'
import useAxiosIns from '@/hooks/useAxiosIns'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'
import ConversationList from '@/features/customer/components/ConversationList'
import ChatWindow from '@/features/customer/components/ChatWindow'

const CustomerChatPageInner = () => {
    const axios = useAxiosIns()
    const isMobile = useIsMobile()
    const user = useSelector((state: RootState) => state.auth.user!)
    const { socket } = useSocketContext()
    const [conversations, setConversations] = useState<IConversation[]>([])
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)

    const getConversationsQuery = useQuery({
        queryKey: ['conversations-all'],
        queryFn: () => axios.get<IResponseData<IConversation[]>>('/chats'),
        refetchOnWindowFocus: false,
        select: res => res.data
    })

    useEffect(() => {
        if (getConversationsQuery.isSuccess && getConversationsQuery.data) {
            setConversations(getConversationsQuery.data?.data)
        }
    }, [getConversationsQuery.isSuccess, getConversationsQuery.data])

    useEffect(() => {
        if (conversations.length > 0) {
            const ids = conversations.map(c => c.conversationId)
            socket?.emit('joinConversations', ids)
        }

        const handleNewConversation = (newConversation: IConversation) => {
            setConversations(prev => [newConversation, ...prev])
        }

        const handleNewMessage = ({ newMessage }: { newMessage: IChatMessage }) => {
            setConversations(prev => {
                const conversationIndex = prev.findIndex(c => c.conversationId === newMessage.conversationId)
                if (conversationIndex === -1) return prev

                const updatedConversation = {
                    ...prev[conversationIndex],
                    lastMessage: newMessage
                }

                const newSortedList = [
                    updatedConversation,
                    ...prev.slice(0, conversationIndex),
                    ...prev.slice(conversationIndex + 1)
                ]
                return newSortedList
            })
        }

        socket?.on('conversation:new', handleNewConversation)
        socket?.on('message:new', handleNewMessage)

        return () => {
            socket?.off('conversation:new', handleNewConversation)
            socket?.off('message:new', handleNewMessage)

            if (conversations.length > 0) {
                const ids = conversations.map(c => c.conversationId)
                socket?.emit('leaveConversations', ids)
            }
        }
    }, [socket, conversations])

    return (
        <div
            className="flex h-full flex-1 flex-col space-y-8 p-4"
            style={{
                maxHeight: isMobile ? 'calc(100vh - 64px - 58px)' : 'calc(100vh - 64px)'
            }}
        >
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user.name}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách cuộc trò chuyện của hệ thống Saigon Steps.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user.avatar} alt={user.name} />
                    </Avatar>
                </div>
            </div>
            <div
                className="flex flex-1 items-start gap-8 overflow-auto"
                style={{
                    maxHeight: 'calc(100% - 96px)'
                }}
            >
                <ConversationList
                    isLoading={getConversationsQuery.isPending}
                    conversations={conversations as any[]}
                    setSelectedConversationId={setSelectedConversationId}
                />
                <ChatWindow
                    selectedConversationId={selectedConversationId}
                    setSelectedConversationId={setSelectedConversationId}
                    hasChatPermission={verifyPermission(user, appPermissions.chatWithCustomer)}
                />
            </div>
        </div>
    )
}

const CustomerChatPage = () => {
    return (
        <SocketProvider>
            <CustomerChatPageInner />
        </SocketProvider>
    )
}

export default CustomerChatPage
