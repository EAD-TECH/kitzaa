export interface ActivityLog {
  /* bıldırım tabı ıcın tanımladm su an sadece path ve comment dusuyor */
  id: string;
  userId: string ;
  title: string;
  description: string;
  time: string;
  relatedId: string;
  linkNotification?: string;
  icon?: string;

  type:
    | "event_join"
    | "post_create"
    | "new_comment"
    | "system_alert"
    | "system-alert"
    | "approved";
  isRead: boolean;
}

export interface OnlineUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  currentPath: string;
  role: string;
  currenthPath?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: string;
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
  selectedUser: OnlineUser | null;
  activeConversationRoomId: string | null;

  /* fonksıyon kalıplarım */
  addActivity: (activity: ActivityLog) => void;
  addChatMessage: (message: ChatMessage) => void;
  setOnlineUsers: (users: OnlineUser[]) => void;
  setActivities: (activites: ActivityLog[]) => void;
  setSocketStatus: (isConnected: boolean) => void;
  markActivityAsRead: (id: string) => void;
  clearActivities: () => void;
  setSelectedUser: (selectedUser: OnlineUser | null) => void;
  setactiveConversationRoomId: (id: string | null) => void;
  clearChatMessage:()=>void
}
