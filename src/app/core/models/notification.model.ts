export interface Notification {
  id: number;
  userId: number;
  message: string;
  type: string; // INFO, SUCCESS, WARNING, ERROR
  read: boolean;
  link?: string;
  createdAt: string;
}
