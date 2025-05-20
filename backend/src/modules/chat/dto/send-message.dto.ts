export class SendMessageDto {
    content: string;
    timestamp?: Date;
    isRead?: boolean;
    isDelivered?: boolean;
    isEdited?: boolean;
    isDeleted?: boolean;
}