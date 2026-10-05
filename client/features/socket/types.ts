export interface TrackActionsProps {
  type: string;
  title: string;
  description: string;
  linkUrl?: string;
  relatedId?: string;
}

export interface SupportMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: string;
  text: string;
  timestamp: string;
  roomId: string;
}

export interface SupportStore {
  supportRoomId: string | null;
  supportMessages: SupportMessage[];
  setSupportRoomId: (id: string | null) => void;
  addSupportMessage: (message: SupportMessage) => void;
  clearSupportSession: () => void;
}
