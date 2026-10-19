import { Role } from "./account.type";

// A notification in the signed-in account's inbox (GET /notifications/received)
export type ReceivedNotification = {
    id: number,
    title: string,
    content: string,
    createdAt: string,
    senderName: string
}

// A notification sent by an ADMIN (GET /notifications)
export type SentNotification = ReceivedNotification & {
    receiversCount: number
}

// Every account with one of the roles receives it, plus the accounts in receiverIds
export type CreateNotification = {
    title: string,
    content: string,
    roles: Role[],
    receiverIds: string[]
}
