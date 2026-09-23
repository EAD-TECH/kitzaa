export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  time: string;
  relatedId: string;
  linkNotification?: string;
  icon?: string;

  type:
    | "new_application"
    | "event_approved"
    | "system_alert"
    | "approved"
    | "rejected";
  isRead: boolean;
}

export interface OnlineUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  currentPath: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  roomId: string;
}

/* burda aksıyonları tanımlıyorm */

export interface LiveWidgetStore {
  activities: ActivityLog[];
  onlineUsers: OnlineUser[];
  chatMessages: ChatMessage[];
  isSocketConnected: boolean;

  /* fonksıyon kalıplarım */
  addActivity: (activity: ActivityLog) => void;
  addChatMessage: (message: ChatMessage) => void;
  setOnlineUsers: (users: OnlineUser[]) => void;
  setSocketStatus: (isConnected: boolean) => void;
  markActivityAsRead: (id: string) => void;
  clearActivities: () => void;
}
