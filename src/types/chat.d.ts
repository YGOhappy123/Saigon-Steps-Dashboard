declare global {
    interface IConversation {
        conversationId: number
        customerId: number

        customer?: Partial<ICustomer>
        messages?: IChatMessage[]
        lastMessage?: Partial<IChatMessage>
    }

    interface IChatMessage {
        messageId: number
        conversationId: number
        senderStaffId?: number
        textContent?: string
        imageContent?: string
        sentAt: string

        senderStaff?: Partial<IStaff>
    }
}

export {}
