export interface MailModel {
  to: string;
  subject: string;
  name?: string;
  text?: string;
  html?: string;
  data?: any;
}
