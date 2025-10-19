import { useMemo, RefObject } from 'react'
import { twMerge } from 'tailwind-merge'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import dayjs from '@/libs/dayjs'

type ChatMessagesDisplayProps = {
    conversation: IConversation
    messageEndRef?: RefObject<HTMLDivElement | null>
}

const ChatMessagesDisplay = ({ conversation, messageEndRef }: ChatMessagesDisplayProps) => {
    const messageGroups = useMemo(() => {
        if (!conversation || !conversation.messages) return []

        return conversation.messages.reduce<
            {
                senderId: number
                messages: IChatMessage[]
            }[]
        >((groups, message) => {
            const senderId = message.senderStaffId ?? 0
            const lastGroup = groups[groups.length - 1]

            if (lastGroup && lastGroup.senderId === senderId) {
                lastGroup.messages.push(message)
            } else {
                groups.push({ senderId, messages: [message] })
            }

            return groups
        }, [])
    }, [conversation?.messages])

    return (
        <>
            <div className="flex flex-col gap-6">
                {messageGroups.map((group, index) => (
                    <MessageGroup key={index} group={group} customer={conversation.customer!} />
                ))}
            </div>
            <div ref={messageEndRef} />
        </>
    )
}

type MessageGroupProps = {
    group: {
        senderId: number
        messages: IChatMessage[]
    }
    customer: Partial<ICustomer>
}

const MessageGroup = ({ group, customer }: MessageGroupProps) => {
    const isCustomer = group.senderId === 0

    return (
        <div className={twMerge('flex w-full gap-4', isCustomer ? '' : 'flex-row-reverse')}>
            <Avatar className="size-12 rounded-full">
                {isCustomer ? (
                    <AvatarImage src={customer?.avatar} alt={customer.name} className="bg-muted" />
                ) : (
                    <AvatarImage
                        src={group.messages[0].senderStaff?.avatar ?? ''}
                        alt={group.messages[0].senderStaff?.name}
                        className="bg-muted"
                    />
                )}
            </Avatar>

            <div className="flex flex-1 flex-col gap-2">
                <>
                    <span
                        className={twMerge('text-muted-foreground font-medium', isCustomer ? 'text-start' : 'text-end')}
                    >
                        {isCustomer ? customer.name : group.messages[0].senderStaff?.name}
                    </span>

                    {group.messages.map(message => (
                        <div
                            key={message.messageId}
                            className={twMerge(
                                'relative flex w-max max-w-[75%] flex-col gap-1 rounded-lg px-3 py-2',
                                isCustomer
                                    ? 'bg-muted rounded-tl-none'
                                    : 'bg-primary text-primary-foreground ml-auto items-end rounded-tr-none'
                            )}
                        >
                            {message.imageContent && (
                                <img
                                    src={message.imageContent}
                                    alt="Message content"
                                    className="max-h-[300px] max-w-[300px] rounded-lg object-contain"
                                />
                            )}
                            {message.textContent && <p>{message.textContent}</p>}
                            <span
                                className={twMerge(
                                    'text-xs font-medium',
                                    isCustomer ? 'text-muted-foreground' : 'text-primary-foreground'
                                )}
                            >
                                {dayjs(message.sentAt).format('DD/MM/YYYY HH:mm')}
                            </span>
                            <div
                                className={twMerge(
                                    'absolute top-0',
                                    isCustomer
                                        ? 'border-muted right-full border-5 border-b-transparent border-l-transparent'
                                        : 'border-primary left-full border-5 border-r-transparent border-b-transparent'
                                )}
                            ></div>
                        </div>
                    ))}
                </>
            </div>
        </div>
    )
}

export default ChatMessagesDisplay
