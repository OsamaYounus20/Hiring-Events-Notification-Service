export interface NotificationChannel {
  send(recipient: string, message: string): Promise<void>;
}
