import { makeIntlFormatter } from 'react-timeago/defaultFormatter'
import { MessageCircleIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import TimeAgo from 'react-timeago'

type ConversationListProps = {
    isLoading: boolean
    conversations: IConversation[]
    setSelectedConversationId: (conversationId: number) => void
}

const ConversationList = ({ isLoading, conversations, setSelectedConversationId }: ConversationListProps) => {
    return (
        <Card className="flex h-full w-2xs flex-col lg:w-xs">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Danh sách cuộc trò chuyện</CardTitle>
                <CardDescription>Danh sách các khách hàng đang trò chuyện với Saigon Steps</CardDescription>
            </CardHeader>
            <CardContent className="no-scrollbar h-full overflow-y-auto px-0 py-0.5">
                {isLoading && (
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
                )}

                {!isLoading && conversations.length === 0 && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-20">
                        <div className="flex size-20 items-center justify-center rounded-full bg-cyan-500/20">
                            <MessageCircleIcon className="size-10 text-cyan-400" />
                        </div>
                        <p className="mt-2 text-center font-semibold">Chưa có cuộc trò chuyện</p>
                        <p className="text-muted-foreground text-center">
                            Hệ thống Saigon Steps chưa ghi nhận cuộc trò chuyện nào với khách hàng!
                        </p>
                    </div>
                )}

                {!isLoading && conversations.length > 0 && (
                    <div className="flex flex-col">
                        {conversations.map((conversation, index) => (
                            <ConversationLine
                                key={conversation.conversationId}
                                conversation={conversation}
                                isLast={index === conversations.length - 1}
                                setSelectedConversationId={setSelectedConversationId}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

type ConversationLineProps = {
    conversation: IConversation
    isLast: boolean
    setSelectedConversationId: (conversationId: number) => void
}

const ConversationLine = ({ conversation, isLast, setSelectedConversationId }: ConversationLineProps) => {
    const intlFormatter = makeIntlFormatter({
        locale: 'vi',
        localeMatcher: 'best fit',
        numberingSystem: 'latn',
        style: 'narrow',
        numeric: 'always'
    })

    const noSuffixFormatter = (...args: Parameters<ReturnType<typeof makeIntlFormatter>>) => {
        const formatted: any = intlFormatter(...args)
        return formatted.replace(/\s*(trước|nữa)$/i, '').trim()
    }

    return (
        <div>
            <div
                key={conversation.conversationId}
                className="hover:bg-muted/80 flex cursor-pointer items-center space-x-4 px-4 py-3.5"
                onClick={() => setSelectedConversationId(conversation.conversationId)}
            >
                <Avatar className="size-12 rounded-full">
                    <AvatarImage src={conversation.customer?.avatar} alt={conversation.customer?.name} />
                </Avatar>
                <div className="flex-1">
                    <h3 className="line-clamp-1 font-semibold">{conversation.customer?.name}</h3>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                        <p className="text-muted-foreground line-clamp-1 text-sm">
                            {conversation.lastMessage?.textContent ?? '<Hình ảnh>'}
                        </p>
                        <TimeAgo
                            date={conversation.lastMessage!.sentAt as string}
                            formatter={noSuffixFormatter}
                            className="text-muted-foreground shrink-0 text-sm italic"
                            {...({} as any)} // Suppress TypeScript error
                        />
                    </div>
                </div>
            </div>

            {!isLast && <Separator className="mx-4" style={{ width: 'calc(100% - 32px)' }} />}
        </div>
    )
}

export default ConversationList
